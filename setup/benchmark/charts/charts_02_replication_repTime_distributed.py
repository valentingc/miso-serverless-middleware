import os
from datetime import datetime

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
         'ytick.labelsize':'x-large'}
pylab.rcParams.update(params)
# input files
files = ["./data/02_replication/repTimeCompleteBucket/distributedLoad/5N_RepTime.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/10N_RepTime.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/20N_RepTime.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/30N_RepTime.csv"]
columnNames = ["5N", "10N", "20N", "30N"]
# output file
output_file = "./data/02_replication/repTimeCompleteBucket/distributedLoad/repTimeMetrics.csv"
figures_directory = 'figures-replication'
if not os.path.exists(figures_directory):
    os.makedirs(figures_directory)
hatches = ['///', '\\', '|', '-']

def convert_duration_to_ms(duration):
    timedelta_duration = pd.to_timedelta(duration)
    duration_ms = timedelta_duration.total_seconds() * 1000

    return duration_ms

def read_and_preprocess(file_name, column_name):
    df = pd.read_csv(file_name, parse_dates=["Time"])
    df.set_index("Time", inplace=True)
    start_time = df.index.min()
    df["MinutesSinceStart"] = (df.index - start_time).total_seconds() / 60
    df.rename(columns={df.columns[0]: column_name}, inplace=True)
    df = df[df[column_name].notna()]
    df[column_name] = df[column_name].apply(convert_duration_to_ms).astype(float)
    return df

def get_pretty_name(type_key):
    print("type_key", type_key)
    if type_key == '50N-200ms':
        return '50N (200ms)'
    else:
        return str(type_key + " (5ms)")
    
with open(output_file, 'w') as f:
    print("Output file created.")
    f.write("Nodes,Mean,Std,Min,Max,25%,50%,75%,95%,99%,\n")

dataframes = []
# loop over files and read
for i in range(len(files)):
    print("Currently processing", files[i], "with column name", columnNames[i])
    df = read_and_preprocess(files[i], columnNames[i])
    print(df.describe(include='all'))
    print("95th percentile", df[columnNames[i]].quantile(0.95))
    print("99th percentile", df[columnNames[i]].quantile(0.99))

    # add metrics to output file
    with open(output_file, 'a') as f:
        f.write(columnNames[i] + "," + str(df[columnNames[i]].mean()) + "," + str(df[columnNames[i]].std()) + "," + str(df[columnNames[i]].min()) + "," + str(df[columnNames[i]].max()) + "," + str(df[columnNames[i]].quantile(0.25)) + "," + str(df[columnNames[i]].quantile(0.50)) + "," + str(df[columnNames[i]].quantile(0.75)) + ","+ str(df[columnNames[i]].quantile(0.95)) + ","+ str(df[columnNames[i]].quantile(0.99)) )
        f.write("\n")
    dataframes.append(df)

# Print vertical bar chart for each DF, the showing average val (maybe 99th percentile in future)
fig, ax = plt.subplots(1, 1, figsize=(10, 5))
for i in range(len(dataframes)):
    mean = dataframes[i][columnNames[i]].mean()
    percentile_99 = dataframes[i][columnNames[i]].quantile(0.99)
    median = dataframes[i][columnNames[i]].median()

    # lower_err = mean - median
    # upper_err = percentile_99 - mean
    # y_err = [[lower_err], [upper_err]]
    # y_err = [[median - dataframes[i][columnNames[i]].quantile(0.50)], [percentile_99 - median]]

    print("Nodes: " , columnNames[i], "Mean", mean, "99th percentile", percentile_99, "Median", median)
    ax.bar(get_pretty_name(columnNames[i]), mean, label=get_pretty_name(columnNames[i]), hatch=hatches[i])
ax.set_ylabel('Time in ms', fontweight='bold')
ax.set_ylim(bottom=0)  # Limit y-axis to minimum value of 0
ax.set_xlabel("Nodes", fontweight='bold')
ax.set_title('Average time to replicate after 5 million requests', fontweight='bold')
ax.grid(axis='y')
plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'replication_time_complete_distributed.png'))
plt.savefig(os.path.join(figures_directory, f'replication_time_complete_distributed.pdf'))

plt.show()
