import os
from datetime import datetime

import matplotlib.pylab as pylab
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import rcParams

params = {'legend.fontsize': 'large',
          'figure.figsize': (10, 5),
         'axes.labelsize': 'x-large',
         'axes.titlesize':'x-large',
         'xtick.labelsize':'x-large',
         'ytick.labelsize':'x-large'}
pylab.rcParams.update(params)

# input files
filesTime = ["./data/02_replication/repTimeCompleteBucket/distributedLoad/5N_RepTime.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/10N_RepTime.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/20N_RepTime.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/30N_RepTime.csv"]
filesRequests = ["./data/02_replication/repTimeCompleteBucket/distributedLoad/5N_Requests.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/10N_Requests.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/20N_Requests.csv", "./data/02_replication/repTimeCompleteBucket/distributedLoad/30N_Requests.csv"]
columnNames = ["5N", "10N", "20N", "30N"]
# output file
output_file = "./data/02_replication/repTimeCompleteBucket/distributedLoad/repTimeMetrics_over_time_distributed.csv"
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

    # read requests file
    requests_file = filesRequests[filesTime.index(file_name)]
    df_requests = pd.read_csv(requests_file, parse_dates=["Time"])
    df_requests.set_index("Time", inplace=True)
    df_requests["MinutesSinceStart"] = (df_requests.index - start_time).total_seconds() / 60
    df_requests.rename(columns={df_requests.columns[0]: column_name}, inplace=True)
    df_requests = df_requests[df_requests[column_name].notna()]
    df_requests = df_requests[df_requests[column_name] > 0]

    merged_df = pd.merge_asof(df, df_requests, on="MinutesSinceStart", direction='nearest')
    merged_df.rename(columns={merged_df.columns[2]: "Requests"}, inplace=True)
    merged_df.rename(columns={merged_df.columns[0]: "Duration"}, inplace=True)
    merged_df = merged_df[merged_df['Requests']<= 5000000]
    merged_df = merged_df[merged_df['Requests']>= 500000]
    # duration_99th_pct = merged_df['Duration'].quantile(0.95)
    # merged_df = merged_df[merged_df['Duration'] < duration_99th_pct]
    print(merged_df.tail(10))
    if 5000000 in merged_df['Requests'].values:
        index_to_keep = merged_df[merged_df['Requests'] == 5000000].index[0]

        filtered_merged_df = merged_df.loc[:index_to_keep]
        return filtered_merged_df
    else:
        return merged_df

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
for i in range(len(filesTime)):
    print("Currently processing", filesTime[i], "with column name", columnNames[i])
    df = read_and_preprocess(filesTime[i], columnNames[i])
    print(df.tail(10))

    # add metrics to output file
    #with open(output_file, 'a') as f:
        #f.write(columnNames[i] + "," + str(df[columnNames[i]].mean()) + "," + str(df[columnNames[i]].std()) + "," + str(df[columnNames[i]].min()) + "," + str(df[columnNames[i]].max()) + "," + str(df[columnNames[i]].quantile(0.25)) + "," + str(df[columnNames[i]].quantile(0.50)) + "," + str(df[columnNames[i]].quantile(0.75)) + ","+ str(df[columnNames[i]].quantile(0.95)) + ","+ str(df[columnNames[i]].quantile(0.99)) )
        #f.write("\n")
    dataframes.append(df)


# print time on y axis and requests on x axis
markers=['o', 's', 'x', 'D']
fig, ax = plt.subplots(1, 1, figsize=(10, 5))
for i in range(len(dataframes)):
    ax.plot(dataframes[i]["Requests"], dataframes[i]["Duration"], label=get_pretty_name(columnNames[i]))
ax.set_ylabel('Time in ms', fontweight='bold')
ax.set_xlabel('Requests in millions', fontweight='bold')
ax.set_ylim(bottom=0)
ax.legend(loc="center right")
ax.grid(axis='y')
ax.set_title('Duration per replication run over time', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'replication_time_over_time_distributed.png'))
plt.savefig(os.path.join(figures_directory, f'replication_time_over_time_distributed.pdf'))

plt.show()