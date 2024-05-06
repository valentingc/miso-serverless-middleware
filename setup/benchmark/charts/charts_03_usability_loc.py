import os
from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import rcParams

rcParams['font.weight'] = 'bold'
# input files
files = ["./data/03_qualitative/linesOfCode.csv", "./data/03_qualitative/cognitiveComplexity.csv"]
column_names = ["Lines of Code", "Cognitive Complexity"]
# output file
figures_directory = 'figures'
if not os.path.exists(figures_directory):
    os.makedirs(figures_directory)
    
colors = ['skyblue', 'lightgreen', 'salmon']
def read_and_preprocess(file_name):
    df = pd.read_csv(file_name)
    return df


dataframes = []
# loop over files and read
for i in range(len(files)):
    print("Currently processing", files[i], "with column name")
    df = read_and_preprocess(files[i])
    print(df.describe(include='all'))
    
    dataframes.append(df)


hatches = ['///', '\\', '|']
merged_dfs = pd.merge(dataframes[0], dataframes[1], on='Type')
merged_dfs.set_index('Type', inplace=True)


fig, ax = plt.subplots(1, 1, figsize=(6, 4))
bar_width = 0.35
index = range(len(merged_dfs))

bar_complexity = ax.bar([i + bar_width for i in index], merged_dfs[column_names[1]], bar_width, label=column_names[1], color=colors[1], hatch=hatches[1])
bar_loc = ax.bar(index, merged_dfs[column_names[0]], bar_width, label=column_names[0], color=colors[0], hatch=hatches[0])
ax.set_xticks([i + bar_width/2 for i in index])
ax.set_xticklabels(merged_dfs.index)
ax.legend()
ax.set_ylabel('Count', fontweight='bold')
ax.set_ylim(bottom=0)  # Limit y-axis to minimum value of 0
ax.set_title('Lines of Code and Cognitive Complexity per Type', fontweight='bold')
ax.grid(axis='y')
plt.tight_layout()
plt.savefig(os.path.join(figures_directory, f'loc.png'))
plt.savefig(os.path.join(figures_directory, f'loc.pdf'))
plt.show()
