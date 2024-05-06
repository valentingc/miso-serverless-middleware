import os
import re
from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# input files
files = ["../data/02_replication/totalRepData/5N_totalRepData.csv", "../data/02_replication/totalRepData/10N_totalRepData.csv", "../data/02_replication/totalRepData/20N_totalRepData.csv", "../data/02_replication/totalRepData/30N_totalRepData.csv", "../data/02_replication/totalRepData/40N_totalRepData.csv",   "../data/02_replication/totalRepData/50N_totalRepData.csv", "../data/02_replication/totalRepData/50N_totalRepData_200ms.csv"]
columnNames = ["5N", "10N", "20N", "30N", "40N", "50N","50N-200ms"]
# output file
output_file = "../data/02_replication/totalRepData/totalRepDataMetrics.csv"
figures_directory = 'figures-replication'
if not os.path.exists(figures_directory):
    os.makedirs(figures_directory)
    
def convert_size_to_mb(size_str):
    size_dict = {'B': 1e-6, 'kB': 1e-3, 'MB': 1, 'GB': 1e3}
    value, unit = re.match(r'([\d.]+)\s*(\w+)', size_str).groups()
    return float(value) * size_dict[unit]

def read_and_preprocess(file_name, column_name):
    df = pd.read_csv(file_name, parse_dates=["Time"])
    df.set_index("Time", inplace=True)
    start_time = df.index.min()
    df["MinutesSinceStart"] = (df.index - start_time).total_seconds() / 60
    df.rename(columns={df.columns[0]: column_name}, inplace=True)
    df = df[df[column_name].notna()]
    df[column_name] = df[column_name].apply(convert_size_to_mb)
    return df

def get_pretty_name(type_key):
    print("type_key", type_key)
    if type_key == '50N-200ms':
        return '50N (200ms)'
    else:
        return str(type_key + " (5ms)")
    
with open(output_file, 'w') as f:
    print("Output file created.")
    f.write("Nodes,TotalData\n")

dataframes = []
# loop over files and read
for i in range(len(files)):
    print("Currently processing", files[i], "with column name", columnNames[i])
    df = read_and_preprocess(files[i], columnNames[i])


    # add metrics to output file
    with open(output_file, 'a') as f:
        f.write(columnNames[i] + "," + str(df[columnNames[i]].tail(1)))
        f.write("\n")
    dataframes.append(df)

# Print vertical bar chart for each DF, the total size of replicated data
fig, ax = plt.subplots(1, 1, figsize=(10, 6))
for i in range(len(dataframes)):
    totalData = dataframes[i][columnNames[i]].tail(1).values[0]#
    print("Nodes: " , columnNames[i], "TotalData", totalData)

    ax.bar(get_pretty_name(columnNames[i]), totalData, label=get_pretty_name(columnNames[i]))
ax.set_ylabel('Size in MB')
ax.set_ylim(bottom=0)
ax.set_title('Total Size of Replicated Data')
ax.grid(axis='y')
plt.savefig(os.path.join(figures_directory, f'total_replication_data.png'))
plt.show()
