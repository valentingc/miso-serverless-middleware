import os
from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# input files
files = ["../data/02_replication/rps/5N_RPS.csv", "../data/02_replication/rps/10N_RPS.csv", "../data/02_replication/rps/20N_RPS.csv", "../data/02_replication/rps/30N_RPS.csv", "../data/02_replication/rps/40N_RPS.csv",   "../data/02_replication/rps/50N_RPS.csv", "../data/02_replication/rps/50N_RPS_200ms.csv"]
columnNames = ["5N", "10N", "20N", "30N", "40N", "50N","50N-200ms"]
# output file
output_file = "../data/02_replication/rps/rpsMetrics.csv"
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
    return 0.0


def read_and_preprocess(file_name, column_name):
    df = pd.read_csv(file_name, parse_dates=["Time"])
    df.set_index("Time", inplace=True)
    start_time = df.index.min()
    df["MinutesSinceStart"] = (df.index - start_time).total_seconds() / 60
    df.rename(columns={df.columns[0]: column_name}, inplace=True)
    df[column_name] = df[column_name].str.replace(' req/s', '')
    df[column_name] = df[column_name].apply(value_to_float).astype(float)
    df = df[df[column_name].notna()]
    df = df[df[column_name] > 0]
    return df

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


def get_pretty_name(type_key):
    print("type_key", type_key)
    if type_key == '50N-200ms':
        return '50N (200ms)'
    else:
        return str(type_key + " (5ms)")
    
# Print vertical bar chart for each DF, the showing average val
fig, ax = plt.subplots(1, 1, figsize=(10, 6))
for i in range(len(dataframes)):
    mean = dataframes[i][columnNames[i]].mean()
    percentile_99 = dataframes[i][columnNames[i]].quantile(0.99)
    median = dataframes[i][columnNames[i]].median()

    print("Nodes: " , columnNames[i], "Mean", mean, "99th percentile", percentile_99, "Median", median)
    ax.bar(get_pretty_name(columnNames[i]), mean, label=get_pretty_name(columnNames[i]))
ax.set_ylabel('Requests per second')
ax.set_ylim(bottom=0)  # Limit y-axis to minimum value of 0
ax.set_title('Average RPS')
ax.grid(axis='y')
plt.savefig(os.path.join(figures_directory, f'rps.png'))
plt.show()
