from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

data_10n = {
    "Time": ["2024-02-17 12:32:20", "2024-02-17 12:32:25", "2024-02-17 12:32:30", "2024-02-17 12:32:35",
             "2024-02-17 12:32:40", "2024-02-17 12:32:45", "2024-02-17 12:32:50", "2024-02-17 12:32:55",
             "2024-02-17 12:33:00", "2024-02-17 12:33:05", "2024-02-17 12:33:10", "2024-02-17 12:33:15",
             "2024-02-17 12:33:20", "2024-02-17 12:33:25", "2024-02-17 12:33:30"],
    "10N": [np.nan, np.nan, np.nan, np.nan, 2.21, 1.16, 0.952, 0.784, 0.722, 0.659, 0.622, 0.582, 0.561, 0.537, 0.523]
}

def read_and_preprocess(file_name, column_name):
    df = pd.read_csv(file_name, parse_dates=["Time"])
    df.set_index("Time", inplace=True)
    start_time = df.index.min()
    df["MinutesSinceStart"] = (df.index - start_time).total_seconds() / 60
    df.rename(columns={df.columns[0]: column_name}, inplace=True)
    return df

df_5n = read_and_preprocess("../data/02_replication/Replication_5N.csv", "5N")
print(df_5n.head())
df_10n = read_and_preprocess("../data/02_replication/Replication_10N.csv", "10N")
df_20n = read_and_preprocess("../data/02_replication/Replication_20N.csv", "20N")
df_50n = read_and_preprocess("../data/02_replication/Replication_50N.csv", "50N")


# Combine all datasets
df_combined = pd.concat([df_5n, df_10n, df_20n, df_50n], axis=1).reset_index()
print("combined")
print(df_combined)
# df_combined["Time"] = pd.to_datetime(df_combined["Time"])

# Normalize time to minutes since start for each dataset
start_time = df_combined["Time"].min()
df_combined["Minutes"] = (df_combined["Time"] - start_time).dt.total_seconds() / 60

# Plotting
plt.figure(figsize=(10, 6))
for column in df_combined.columns[1:-1]:  # Skip 'Time' and 'Minutes' columns
    plt.plot(df_combined["Minutes"], df_combined[column], label=column)

plt.xlabel('Minutes since start')
plt.ylabel('Time in ms')
plt.title('Performance over Time')
plt.legend()
plt.grid(True)
plt.show()