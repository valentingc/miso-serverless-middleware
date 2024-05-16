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
#rcParams['font.weight'] = 'bold'
# input files
filesTime = ["./data/02_replication/rps/distributedLoad/5N_RPS.csv","./data/02_replication/rps/distributedLoad/10N_RPS.csv","./data/02_replication/rps/distributedLoad/20N_RPS.csv","./data/02_replication/rps/distributedLoad/30N_RPS.csv"]#, "./data/02_replication/rps/distributedLoad/10N_RPS.csv", "./data/02_replication/rps/distributedLoad/20N_RPS.csv", "./data/02_replication/rps/distributedLoad/30N_RPS.csv", "./data/02_replication/rps/distributedLoad/40N_RPS.csv",   "./data/02_replication/rps/distributedLoad/50N_RPS.csv", "./data/02_replication/rps/distributedLoad/50N_RPS_200ms.csv"
filesRequests = ["./data/02_replication/rps/distributedLoad/5N_Requests.csv","./data/02_replication/rps/distributedLoad/10N_Requests.csv","./data/02_replication/rps/distributedLoad/20N_Requests.csv","./data/02_replication/rps/distributedLoad/30N_Requests.csv"]#, "./data/02_replication/repTimeCompleteBucket/10N_Requests.csv", "./data/02_replication/repTimeCompleteBucket/20N_Requests.csv", "./data/02_replication/repTimeCompleteBucket/30N_Requests.csv", "./data/02_replication/repTimeCompleteBucket/40N_Requests.csv",   "./data/02_replication/repTimeCompleteBucket/50N_Requests.csv", "./data/02_replication/repTimeCompleteBucket/50N_Requests_200ms.csv"]
files_repl = ["./data/02_replication/rps_replication/distributedLoad/5N_RPS.csv","./data/02_replication/rps_replication/distributedLoad/10N_RPS.csv","./data/02_replication/rps_replication/distributedLoad/20N_RPS.csv","./data/02_replication/rps_replication/distributedLoad/30N_RPS.csv"]#, "./data/02_replication/rps/distributedLoad/10N_RPS.csv", "./data/02_replication/rps/distributedLoad/20N_RPS.csv", "./data/02_replication/rps/distributedLoad/30N_RPS.csv", "./data/02_replication/rps/distributedLoad/40N_RPS.csv",   "./data/02_replication/rps/distributedLoad/50N_RPS.csv", "./data/02_replication/rps/distributedLoad/50N_RPS_200ms.csv"
columnNames = ["5N", "10N", "20N", "30N"]#"10N", "20N", "30N", "40N", "50N","50N-200ms"
# output file
output_file = "./data/02_replication/rps/rpsMetrics_over_time_distributed.csv"
figures_directory = 'figures-replication'
if not os.path.exists(figures_directory):
    os.makedirs(figures_directory)
    
def value_to_float(x):
    if type(x) == float or type(x) == int:
        return x
    if 'K' in x:
        if len(x) > 1:
            return float(x.replace('K', '')) * 1000
        return 1000.0
    if 'M' in x:
        if len(x) > 1:
            return float(x.replace('M', '')) * 1000000
        return 1000000.0
    if 'B' in x:
        return float(x.replace('B', '')) * 1000000000
    return x

def read_and_preprocess(file_name, column_name):
    df = pd.read_csv(file_name, parse_dates=["Time"])
    df.set_index("Time", inplace=True)
    start_time = df.index.min()
    df["MinutesSinceStart"] = (df.index - start_time).total_seconds() / 60
    df.rename(columns={df.columns[0]: column_name}, inplace=True)
    df[column_name] = df[column_name].str.replace(' req/s', '')
    if (column_name == "30N"):
        print("----")
        print(df)
    df[column_name] = df[column_name].apply(value_to_float).astype(float)
    df = df[df[column_name].notna()]
    df = df[df[column_name] > 0]
    if (column_name == "30N"):
        print("----")
        print(df)
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
    merged_df.rename(columns={merged_df.columns[0]: "RPS"}, inplace=True)
    merged_df = merged_df[merged_df['Requests']<= 4000000]
    merged_df = merged_df[merged_df['Requests']>= 1000000]


    replicationRequestsFile = files_repl[filesTime.index(file_name)]
    df_repl = pd.read_csv(replicationRequestsFile, parse_dates=["Time"])
    df_repl.set_index("Time", inplace=True)
    df_repl["MinutesSinceStart"] = (df_repl.index - start_time).total_seconds() / 60
    df_repl.rename(columns={df_repl.columns[0]: "ReplicationRequests"}, inplace=True)
    # df_repl = df_repl[df_repl[column_name].notna()]
    # df_repl = df_repl[df_repl[column_name] > 0]
    merged_df_repl = pd.merge_asof(merged_df, df_repl, on="MinutesSinceStart", direction='nearest')
    merged_df_repl["ReplicationRequests"] = merged_df_repl["ReplicationRequests"].str.replace(' req/s', '')
    merged_df_repl["ReplicationRequests"] = merged_df_repl["ReplicationRequests"].apply(value_to_float).astype(float)
    
    merged_df_repl["TotalRequests"] = merged_df_repl["ReplicationRequests"] + merged_df_repl["RPS"]
    # merged_df = merged_df[merged_df['MinutesSinceStart'] >= (10/60)]
    if 5000000 in merged_df_repl['Requests'].values:
        index_to_keep = merged_df_repl[merged_df_repl['Requests'] == 5000000].index[0]

        filtered_merged_df = merged_df_repl.loc[:index_to_keep]
        return filtered_merged_df
    else:
        return merged_df_repl

def get_pretty_name(type_key, type):
    if type_key == '50N-200ms':
        return '50N (200ms)'
    else:
        return str(type_key + " ("  + type + ")" )
    
def get_cluster_color(type_key):
    if type_key == '5N':
        return 'blue'
    elif type_key == '10N':
        return 'orange'
    elif type_key == '20N':
        return 'green'
    elif type_key == '30N':
        return 'red'
    return 'black'

with open(output_file, 'w') as f:
    print("Output file created.")
    f.write("Nodes,Mean,Std,Min,Max,25%,50%,75%,95%,99%,\n")

dataframes = []
# loop over files and read
for i in range(len(filesTime)):
    #print("Currently processing", filesTime[i], "with column name", columnNames[i])
    df = read_and_preprocess(filesTime[i], columnNames[i])

    print("Currently processing", i, " - ", files_repl[i], "with column name", columnNames[i])
    # df_repl = read_and_preprocess(files_repl[i], str(columnNames[i]+"_replication"))
    # df['requests_replication'] = df_repl[columnNames[i]+"_replication"]
    # df['total_requests'] = df[columnNames[i]] + df_repl[columnNames[i]+"_replication"]

    # add metrics to output file
    #with open(output_file, 'a') as f:
        #f.write(columnNames[i] + "," + str(df[columnNames[i]].mean()) + "," + str(df[columnNames[i]].std()) + "," + str(df[columnNames[i]].min()) + "," + str(df[columnNames[i]].max()) + "," + str(df[columnNames[i]].quantile(0.25)) + "," + str(df[columnNames[i]].quantile(0.50)) + "," + str(df[columnNames[i]].quantile(0.75)) + ","+ str(df[columnNames[i]].quantile(0.95)) + ","+ str(df[columnNames[i]].quantile(0.99)) )
        #f.write("\n")
    dataframes.append(df)


# print time on y axis and requests on x axis
fig, ax = plt.subplots(1, 1, figsize=(10, 5))
for i in range(len(dataframes)):
    print(dataframes[i])
    ax.plot(dataframes[i]["Requests"], dataframes[i]["RPS"], label=get_pretty_name(columnNames[i], "Core"), color=get_cluster_color(columnNames[i]))
    ax.plot(dataframes[i]["Requests"], dataframes[i]["ReplicationRequests"], label=get_pretty_name(columnNames[i], "Replication"), linestyle='dashed',color=get_cluster_color(columnNames[i]))
    

ax.set_ylabel('RPS (total of all nodes)', fontweight='bold')
ax.set_xlabel('Requests in millions', fontweight='bold')
ax.set_ylim(bottom=0)
ax.legend()
ax.grid(axis='y')
ax.set_title('RPS over Time (Core + Replication with 5ms interval)', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'rps_time_over_time_withRep_distributed.png'))
plt.savefig(os.path.join(figures_directory, f'rps_time_over_time_withRep_distributed.pdf'))

plt.show()