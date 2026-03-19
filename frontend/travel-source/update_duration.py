import os
import glob
import re

directories_to_search = [
    os.path.join("src", "components", "Trips"),
    os.path.join("src", "pages")
]

files = []
for d in directories_to_search:
    for root, _, filenames in os.walk(d):
        for filename in filenames:
            if filename.endswith(".jsx"):
                files.append(os.path.join(root, filename))

# We want to replace instances formatted as `{trip.duration_days - 1}N/{trip.duration_days}D` spanning multiple lines
# Also basic `{trip.duration_days} Days`
# Also basic `{trip.duration_days} DAYS`

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # 1. Replace multi-line explicit `${trip.duration_days - 1}N/${trip.duration_days}D` logic
    # The current pattern is:
    #                       {trip.duration_days
    #                         ? `${trip.duration_days - 1}N/${trip.duration_days}D`
    #                         : "N/A"}
    # Or just generic inline: `${trip.duration_days - 1}N/${trip.duration_days}D`
    
    # We can match the literal code blocks where people do trip.duration_days - 1
    # Replace anything resembling `${trip.duration_days - 1}N/${trip.duration_days}D`
    content = re.sub(
        r'`\$\{trip\.duration_days - 1\}N/\$\{trip\.duration_days\}D`',
        r'`${trip.duration_days} Days${trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}`',
        content
    )

    # 2. Replace simple `{trip.duration_days} Days` and `{trip.duration_days} DAYS`
    # But ONLY if it isn't inside AdminTrips (we already did that and we don't want to mess it up, although we only scan src/components and src/pages)
    content = re.sub(
        r'\{trip\.duration_days\} Days',
        r'{trip.duration_days} Days{trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}',
        content
    )
    content = re.sub(
        r'\{trip\.duration_days\} DAYS',
        r'{trip.duration_days} DAYS{trip.duration_nights > 0 ? " / " + trip.duration_nights + " NIGHTS" : ""}',
        content
    )
    
    # 3. PersonalizationSection explicitly does: {trip.duration_days} {trip.duration_days === 1 ? "day" : "days"}
    content = re.sub(
        r'\{trip\.duration_days\}\s+\{trip\.duration_days === 1 \? "day" : "days"\}',
        r'{trip.duration_days} {trip.duration_days === 1 ? "Day" : "Days"}{trip.duration_nights > 0 ? ` / ${trip.duration_nights} Nights` : ""}',
        content
    )

    if content != original_content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filepath}")

print("Done updating trip durations.")
