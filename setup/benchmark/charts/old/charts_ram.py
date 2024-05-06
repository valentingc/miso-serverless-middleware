import os
import re
from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# input files
files = ["../data/02_replication/ram/5N_V4.csv", "../data/02_replication/ram/10N_V4.csv", "../data/02_replication/ram/20N_V4.csv", "../data/02_replication/ram/30N_V4.csv"]
columnNames = ["5N", "10N", "20N", "30N", "40N", "50N","50N-200ms"]
# output file
output_file = "./data/ramMetrics.csv"
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
    df = df.filter(like='Process Memory')
    memory_columns = df.columns[0:]
    df[memory_columns] = df[memory_columns].div(1024 ** 2)
    max_ram_column = df[memory_columns].max(axis=0).idxmax()
    
    df = df[[max_ram_column]]
    start_time = df.index.min()
    df["MinutesSinceStart"] = (df.index - start_time).total_seconds() / 60
    df.rename(columns={df.columns[0]: column_name}, inplace=True)
    
    df = df[df[column_name].notna()]

    return df

def get_pretty_name(type_key):
    print("type_key", type_key)
    if type_key == '50N-200ms':
        return '50N (200ms)'
    else:
        return str(type_key + " (5ms)")
    


dataframes = []
# loop over files and read
for i in range(len(files)):
    print("Currently processing", files[i], "with column name", columnNames[i])
    df = read_and_preprocess(files[i], columnNames[i])
    dataframes.append(df)

fig, ax = plt.subplots(1, 1, figsize=(10, 6))
for i in range(len(dataframes)):
    totalData = dataframes[i].max().values[0]
    print("Nodes: " , columnNames[i], "TotalData", totalData)

    ax.bar(get_pretty_name(columnNames[i]), totalData, label=get_pretty_name(columnNames[i]))
ax.set_ylabel('Size in MB')
ax.set_ylim(bottom=0)
ax.set_title('Maximum RAM Usage')
ax.grid(axis='y')
plt.savefig(os.path.join(figures_directory, f'ram_data.png'))
plt.show()
