import json
import os

import matplotlib.pylab as pylab
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import rcParams

params = {'legend.fontsize': 'large',
          'figure.figsize': (15, 5),
         'axes.labelsize': 'x-large',
         'axes.titlesize':'x-large',
         'xtick.labelsize':'x-large',
         'ytick.labelsize':'x-large',
         'font.weight': 'bold'}
pylab.rcParams.update(params)

# Constants
JSON_FILE_PATH = './data/01_allreduce/01_Performance_AllReduce.json'
DATA_TYPES = ['miso-sameNode','miso', 'redis', 'minio', 'minio-replicated']
DATA_TYPE_SELECTED = 'miso'


figures_directory = 'figures'
if not os.path.exists(figures_directory):
    os.makedirs(figures_directory)


colors = {'miso': 'skyblue', 'miso-sameNode': 'darkblue','redis': 'lightgreen', 'minio': 'salmon', 'minio-replicated': '#a82b1d'}
colors_read = {
    'miso': '#2b8ced',
    'miso-sameNode': '#2b8ced',
    'redis': '#2b8ced',
    'minio': '#2b8ced',
    'minio-replicated': '#2b8ced'
}
colors_write = {
    'miso': '#ed2b2b',
    'miso-sameNode': '#ed2b2b',
    'redis': '#ed2b2b',
    'minio': '#ed2b2b',
    'minio-replicated': '#ed2b2b'
}

def process_json_data(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)

        return data

    except Exception as e:
        return {"error": str(e)}
data = process_json_data(JSON_FILE_PATH)

all_statistics = {}
all_dataframes = {}
def process_data_and_stats(data, type_key):
    records = []
    for time_key, results in data[type_key].items():
        records.extend(results)

    dataframe = pd.DataFrame(records)
    percentile_99 = dataframe['timeTotal'].quantile(0.99)
    dataframe_filtered = dataframe[dataframe['timeTotal'] <= percentile_99]

    print(f"\nStatistics for {type_key}:")
    print("Average Time Total:", round(dataframe_filtered['timeTotal'].mean(),0))
    print("Minimum Time Total:", round(dataframe_filtered['timeTotal'].min(),0))
    print("Maximum Time Total:", round(dataframe_filtered['timeTotal'].max(),0))
    print("25th Percentile:", round(dataframe_filtered['timeTotal'].quantile(0.25),0))
    print("Median:", round(dataframe_filtered['timeTotal'].quantile(0.5)),0)
    print("75th Percentile:", round(dataframe_filtered['timeTotal'].quantile(0.75),0))
    print("99th Percentile:", round(dataframe_filtered['timeTotal'].quantile(0.99),0))

    print("Average Read Time:", round(dataframe_filtered['timeRead'].mean(),0))
    print("Std. Deviation Read Time:", round(dataframe_filtered['timeRead'].std(),0))
    print("Average Write Time:", round(dataframe_filtered['timeWrite'].mean(),0))
    print("Std. Deviation Write Time:", round(dataframe_filtered['timeWrite'].std(),0))
    statistics = {
        "average": round(dataframe_filtered['timeTotal'].mean(),0),
        "minimum": round(dataframe_filtered['timeTotal'].min(),0),
        "maximum": round(dataframe_filtered['timeTotal'].max(),0),
        "25th_percentile": round(dataframe_filtered['timeTotal'].quantile(0.25),0),
        "median": round(dataframe_filtered['timeTotal'].quantile(0.5),0),
        "75th_percentile": round(dataframe_filtered['timeTotal'].quantile(0.75),0),
        "99th_percentile": round(dataframe_filtered['timeTotal'].quantile(0.99),0),
        "average_read": round(dataframe_filtered['timeRead'].mean(),0),
        "average_write": round(dataframe_filtered['timeWrite'].mean(),0)
    }

    return dataframe_filtered,statistics

def get_pretty_name(type_key):
    if type_key == 'miso-sameNode':
        return 'MISO (1N)'
    elif type_key == 'miso':
        return 'MISO (5N)'
    elif type_key == 'redis':
        return 'Redis Enterprise'
    elif type_key == 'minio':
        return 'MinIO'
    elif type_key == 'minio-replicated':
        return 'MinIO Replicated'
    else:
        return type_key

###############################
####### COMBINED CHARTS #######
###############################
plt.figure(figsize=(12, 8))
plt.subplot(3, 1, 1)
for type_key in DATA_TYPES:
    print("type_key: ", type_key)
    if type_key in data:
        dataframe_filtered,statistics = process_data_and_stats(data, type_key)
        all_statistics[type_key] = statistics
        all_dataframes[type_key] = dataframe_filtered
        bins = [250,500,750,1000,1250,1500,1750,2000,2250,2500,2750,3000,3250,3500,3750,4000]

        plt.hist(dataframe_filtered['timeTotal'],  color=colors[type_key],  #bins=bins,
                 edgecolor='black', alpha=0.5, label=get_pretty_name(type_key))
#plt.xticks(bins)
plt.xlabel('Time Total (ms)', fontweight='bold')
plt.ylabel('Frequency', fontweight='bold')
plt.title('AllReduce: Histogram of Total Time by Type', fontweight='bold')
plt.legend()
plt.grid(axis='y')
plt.tight_layout()

# Line chart
plt.subplot(3, 1, 2)
for type_key in DATA_TYPES:
    if type_key in data:
        dataframe_filtered,statistics  = process_data_and_stats(data, type_key)
        plt.plot(dataframe_filtered['testRun'], dataframe_filtered['timeTotal'], label=get_pretty_name(type_key), color=colors[type_key], marker='.', markersize=1)
plt.xlabel('Test Run', fontweight='bold')
plt.ylabel('Time Total (ms)', fontweight='bold')
plt.title('AllReduce: Time Total per Test Run by Type', fontweight='bold')
plt.legend()
plt.grid(True)
plt.tight_layout()

fig = plt.subplot(3, 1, 3)
boxplot_data = []
boxplot_labels = []
for type_key in DATA_TYPES:
    if type_key in data:
        dataframe_filtered,statistics  = process_data_and_stats(data, type_key)
        boxplot_data.append(dataframe_filtered['timeTotal'])
        boxplot_labels.append(get_pretty_name(type_key))

plt.boxplot(boxplot_data, labels=boxplot_labels)
plt.xlabel('Type', fontweight='bold')
plt.ylabel('Time Total (ms)', fontweight='bold')
plt.title('AllReduce: Boxplot of Total Time by Type', fontweight='bold')
plt.grid(axis='y')

plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'combined_chart.png'))
plt.savefig(os.path.join(figures_directory, f'combined_chart.pdf'))
plt.close()

# same charts separate
## histogram

plt.figure(figsize=(12, 5))
for type_key in DATA_TYPES:
    print("type_key: ", type_key)
    if type_key in data:
        dataframe_filtered,statistics = process_data_and_stats(data, type_key)
        all_statistics[type_key] = statistics
        #bins = [250,500,750,1000,1250,1500,1750,2000,2250,2500,2750,3000,3250,3500,3750,4000]

        plt.hist(dataframe_filtered['timeTotal'],  color=colors[type_key], #bins=bins,
                 edgecolor='black', alpha=0.5, label=get_pretty_name(type_key))
#plt.xticks(bins)
plt.xlabel('Time Total (ms)', fontweight='bold')
plt.ylabel('Frequency', fontweight='bold')
plt.title('AllReduce: Histogram of Total Time by Type', fontweight='bold')
plt.legend()
plt.tight_layout()
plt.grid(axis='y')
plt.savefig(os.path.join(figures_directory, f'combined_histogram.png'))
plt.savefig(os.path.join(figures_directory, f'combined_histogram.pdf'))
plt.close()

## boxplot
plt.figure(figsize=(10,5))
boxplot_data = []
boxplot_labels = []
for type_key in DATA_TYPES:
    if type_key in data:
        dataframe_filtered,statistics  = process_data_and_stats(data, type_key)
        boxplot_data.append(dataframe_filtered['timeTotal'])
        boxplot_labels.append(get_pretty_name(type_key))

plt.boxplot(boxplot_data, labels=boxplot_labels)
plt.xlabel('Type', fontweight='bold')
plt.ylabel('Time Total (ms)', fontweight='bold')
plt.title('AllReduce: Boxplot of Total Time by Type', fontweight='bold')
plt.grid(axis='y')
plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'combined_boxplot.png'))
plt.savefig(os.path.join(figures_directory, f'combined_boxplot.pdf'))
plt.close()

## line chart
plt.figure(figsize=(10,5))
for type_key in DATA_TYPES:
    if type_key in data:
        dataframe_filtered,statistics  = process_data_and_stats(data, type_key)
        plt.plot(dataframe_filtered['testRun'], dataframe_filtered['timeTotal'], label=get_pretty_name(type_key), color=colors[type_key], marker='.', markersize=1)
plt.xlabel('Test Run', fontweight='bold')
plt.ylabel('Time Total (ms)', fontweight='bold')
plt.title('AllReduce: Time Total per Test Run by Type', fontweight='bold')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'combined_linechart.png'))
plt.savefig(os.path.join(figures_directory, f'combined_linechart.pdf'))
plt.close()

##############################
####### SEPARTE CHARTS #######
##############################
for type_key in DATA_TYPES:
    if type_key in data:
        dataframe_filtered,statistics  = process_data_and_stats(data, type_key)

        # Separate histogram, bins=bins, 
        plt.figure(figsize=(10,5))
        plt.hist(dataframe_filtered['timeTotal'],color=colors[type_key], 
                 edgecolor='black', alpha=0.5)
        # plt.xticks(bins)
        plt.xlabel('Time Total (ms)', fontweight='bold')
        plt.ylabel('Frequency', fontweight='bold')
        plt.title(f'{get_pretty_name(type_key)} - Histogram of Total Time', fontweight='bold')
        plt.grid(axis='y')
        plt.tight_layout()
        plt.savefig(os.path.join(figures_directory, f'{type_key}_histogram.png'))
        plt.savefig(os.path.join(figures_directory, f'{type_key}_histogram.pdf'))
        plt.close()
        # plt.show()

        # Separate line chart
        plt.figure(figsize=(10, 5))
        plt.plot(dataframe_filtered['testRun'], dataframe_filtered['timeTotal'], 
                 label=get_pretty_name(type_key), color=colors[type_key], marker='.', markersize=1)
        plt.xlabel('Test Run', fontweight='bold')
        plt.ylabel('Time Total (ms)', fontweight='bold')
        plt.title(f'{get_pretty_name(type_key)} - Time Total per Test Run', fontweight='bold')
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(os.path.join(figures_directory, f'{type_key}_line_chart.png'))
        plt.savefig(os.path.join(figures_directory, f'{type_key}_line_chart.pdf'))
        plt.close()
        # plt.show()

        # Separate boxplot
        boxplot_data_to_plot = [
            dataframe_filtered['timeTotal'], 
            # dataframe_filtered['timeRead'], 
            # dataframe_filtered['timeWrite']
        ]
        boxplot_labels = [
            f'{get_pretty_name(type_key)} - Time Total',
                        #    f'{type_key} - Time Read',
                        #      f'{type_key} - Time Write'
                             ]


        plt.figure(figsize=(10,5))
        plt.boxplot(boxplot_data_to_plot)#, labels=boxplot_labels
        plt.xlabel(f'{get_pretty_name(type_key)} - Time Total', fontweight='bold')
        plt.ylabel('Time (ms)', fontweight='bold')
        plt.title(f'{get_pretty_name(type_key)} - Time Total per Test Run', fontweight='bold')
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(os.path.join(figures_directory, f'{type_key}_boxplot.png'))
        plt.savefig(os.path.join(figures_directory, f'{type_key}_boxplot.pdf'))
        plt.close()
        # plt.show()

        
        # Separate line chart - time read vs. time write
        plt.figure(figsize=(10,5))
        plt.plot(dataframe_filtered['testRun'], dataframe_filtered['timeRead'], 
                 label=f'{get_pretty_name(type_key)} - Time Read', color=colors_read[type_key], marker='.', markersize=1)

        plt.plot(dataframe_filtered['testRun'], dataframe_filtered['timeWrite'], 
                 label=f'{get_pretty_name(type_key)} - Time Write', color=colors_write[type_key], marker='.', markersize=1)
        plt.xlabel('Test Run', fontweight='bold')
        plt.ylabel('Time (ms)', fontweight='bold')
        plt.title(f'{get_pretty_name(type_key)} - Time Read vs. Write per Test Run', fontweight='bold')
        plt.grid(True)
        plt.tight_layout()
        plt.legend()
        plt.savefig(os.path.join(figures_directory, f'{type_key}_line_chart_read_write.png'))
        plt.savefig(os.path.join(figures_directory, f'{type_key}_line_chart_read_write.pdf'))
        plt.close()
        # plt.show()



####### COMBINED GROUPED BARCHART #######
## Prepare Data
categories =["average", "minimum", "maximum", "25th_percentile", "median", "75th_percentile", "99th_percentile"]
labels = DATA_TYPES

## Configure
types = list(DATA_TYPES)
types_pretty_names = [get_pretty_name(type_) for type_ in types]

metrics = ['average', 'average_read','average_write','99th_percentile']
hatches = ['///', '\\', '|', '-']

num_types = len(types)
num_metrics = len(metrics)
group_width = 0.8
bar_width = group_width / num_metrics
space_between_groups = 0.05
x = np.arange(num_types)

## Plot
fig, ax = plt.subplots(figsize=(10,5))
for i, metric in enumerate(metrics):
    values = [all_statistics[type_][metric] for type_ in types]
    bar_positions = x * (1 + space_between_groups) - (group_width - bar_width) / 2 + i * bar_width
    container = ax.bar(bar_positions, values, bar_width, label=metric, hatch=hatches[i])
    ax.bar_label(container, padding=3, label_type='edge', fontsize=8)

ax.set_ylabel('Time (ms)', fontweight='bold')
ax.set_title('Metrics grouped by type', fontweight='bold')
ax.set_xticks(x * (1 + space_between_groups))
ax.set_xticklabels(types_pretty_names)
ax.set_xlabel("Type", fontweight='bold')
ax.legend(title="Metric", labels=['Total Average', 'Average Read', 'Average Write', '99th Percentile'])
plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'combined_grouped_barchart.png'))
plt.savefig(os.path.join(figures_directory, f'combined_grouped_barchart.pdf'))
plt.close()

########### READ vs. WRITE MINIO / MINIO REPLICATED

plt.figure(figsize=(10,5))
plt.plot(all_dataframes['minio']['testRun'], all_dataframes['minio']['timeTotal'], 
            label=f'MinIO - Average Time Total', color=colors["minio"], marker='.', markersize=1)
plt.plot(all_dataframes['minio-replicated']['testRun'], all_dataframes['minio-replicated']['timeTotal'], 
            label=f'MinIO Replicated - Average Time Total', color=colors["minio-replicated"], marker='.', markersize=1)
plt.xlabel('Test Run', fontweight='bold')
plt.ylabel('Time (ms)', fontweight='bold')
plt.title(f'MinIO vs. MinIO Replicated - Time Total per Test Run', fontweight='bold')
plt.grid(True)
plt.tight_layout()
plt.legend()
plt.savefig(os.path.join(figures_directory, f'minio_vs_minio-rep_line_chart_time_total.png'))
plt.savefig(os.path.join(figures_directory, f'minio_vs_minio-rep_line_chart_time_total.pdf'))
plt.close()

########### All Reads
plt.figure(figsize=(10,5))
plt.plot(all_dataframes['miso']['testRun'], all_dataframes['miso']['timeRead'].rolling(window=10).mean(), 
            label=f'MISO (1N) - Average Time Read', color=colors["miso"], marker='.', markersize=1)
plt.plot(all_dataframes['miso-sameNode']['testRun'], all_dataframes['miso-sameNode']['timeRead'].rolling(window=10).mean(), 
            label=f'MISO (1N) - Average Time Read', color=colors["miso-sameNode"], marker='.', markersize=1)
plt.plot(all_dataframes['redis']['testRun'], all_dataframes['redis']['timeRead'].rolling(window=10).mean(), 
            label=f'Redis Enterprise - Average Time Read', color=colors["redis"], marker='.', markersize=1)
plt.plot(all_dataframes['minio']['testRun'], all_dataframes['minio']['timeRead'].rolling(window=10).mean(), 
            label=f'MinIO - Average Time Read', color=colors["minio"], marker='.', markersize=1)
plt.plot(all_dataframes['minio-replicated']['testRun'], all_dataframes['minio-replicated']['timeRead'].rolling(window=10).mean(), 
            label=f'MinIO Replicated - Average Time Read', color=colors["minio-replicated"], marker='.', markersize=1)
plt.xlabel('Test Run', fontweight='bold')
plt.ylabel('Time (ms)', fontweight='bold')
plt.title(f'Time Read per Test Run (Moving Average)', fontweight='bold')
plt.grid(True)
plt.tight_layout()
plt.legend()
plt.savefig(os.path.join(figures_directory, f'all_reads_line_chart_time_total.png'))
plt.savefig(os.path.join(figures_directory, f'all_reads_line_chart_time_total.pdf'))
plt.close()
########### All Writes
plt.figure(figsize=(10,5))
plt.plot(all_dataframes['miso']['testRun'], all_dataframes['miso']['timeWrite'].rolling(window=10).mean(), 
            label=f'MISO (5N) - Average Time Write', color=colors["miso"], marker='.', markersize=1)
plt.plot(all_dataframes['miso-sameNode']['testRun'], all_dataframes['miso-sameNode']['timeWrite'].rolling(window=10).mean(), 
            label=f'MISO (1N) - Average Time Write', color=colors["miso-sameNode"], marker='.', markersize=1)
plt.plot(all_dataframes['redis']['testRun'], all_dataframes['redis']['timeWrite'].rolling(window=10).mean(), 
            label=f'Redis Enterprise - Average Time Write', color=colors["redis"], marker='.', markersize=1)
plt.plot(all_dataframes['minio']['testRun'], all_dataframes['minio']['timeWrite'].rolling(window=10).mean(), 
            label=f'MinIO - Average Time Write', color=colors["minio"], marker='.', markersize=1)
plt.plot(all_dataframes['minio-replicated']['testRun'], all_dataframes['minio-replicated']['timeWrite'].rolling(window=10).mean(), 
            label=f'MinIO Replicated - Average Time Write', color=colors["minio-replicated"], marker='.', markersize=1)
plt.xlabel('Test Run', fontweight='bold')
plt.ylabel('Time (ms)', fontweight='bold')
plt.title(f'Time Write per Test Run (Moving Average)', fontweight='bold')
plt.grid(True)
plt.tight_layout()
plt.legend()
plt.savefig(os.path.join(figures_directory, f'all_writes_line_chart_time_total.png'))
plt.savefig(os.path.join(figures_directory, f'all_writes_line_chart_time_total.pdf'))
plt.close()