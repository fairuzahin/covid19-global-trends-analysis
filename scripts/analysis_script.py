import pandas as pd
import matplotlib.pyplot as plt

# Load the worldwide aggregate data
worldwide_aggregate = pd.read_csv("data/worldwide-aggregate.csv")

# Convert 'Date' column to datetime format
worldwide_aggregate['Date'] = pd.to_datetime(worldwide_aggregate['Date'])

# Plotting global trends for Confirmed, Recovered, and Deaths
plt.figure(figsize=(10, 6))
plt.plot(worldwide_aggregate['Date'], worldwide_aggregate['Confirmed'], label='Confirmed Cases', color='blue')
plt.plot(worldwide_aggregate['Date'], worldwide_aggregate['Recovered'], label='Recovered Cases', color='green')
plt.plot(worldwide_aggregate['Date'], worldwide_aggregate['Deaths'], label='Deaths', color='red')

# Adding labels and title
plt.title('Global COVID-19 Trends: Confirmed, Recovered, and Deaths', fontsize=14)
plt.xlabel('Date', fontsize=12)
plt.ylabel('Number of Cases', fontsize=12)
plt.legend()

# Save the plot
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('images/covid19_global_trends.png')
