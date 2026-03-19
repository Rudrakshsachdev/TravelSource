import os, re

# Fix all broken duration patterns across the frontend

directories_to_search = [
    os.path.join("src", "components", "Trips"),
    os.path.join("src", "pages"),
    os.path.join("src", "admin"),
]

files = []
for d in directories_to_search:
    for root, _, filenames in os.walk(d):
        for filename in filenames:
            if filename.endswith(".jsx"):
                files.append(os.path.join(root, filename))

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # ============================================================
    # FIX 1: Broken template-literal patterns (inside backticks)
    # The previous regex put JSX {trip.duration_nights ...} inside
    # backtick strings.  These need to be ${...} and deduplicated.
    # Pattern looks like:
    #   `${trip.duration_days} Days{trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}${trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}`
    # Should become:
    #   `${trip.duration_days} Days${trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}`
    # ============================================================
    content = re.sub(
        r'`\$\{trip\.duration_days\} Days\{trip\.duration_nights > 0 \? " / " \+ trip\.duration_nights \+ " Nights" : ""\}\$\{trip\.duration_nights > 0 \? " / " \+ trip\.duration_nights \+ " Nights" : ""\}`',
        '`${trip.duration_days} Days${trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}`',
        content
    )

    # ============================================================
    # FIX 2: Plain JSX contexts where the expression was correctly
    # placed but outside curly braces. These look like:
    #   {trip.duration_days} Days{trip.duration_nights > 0 ? " / " ...}
    # But in JSX, the second part needs its own {} wrapper.
    # We need to ensure these render as:
    #   {trip.duration_days} Days{trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}
    # BUT only when NOT inside a template literal. Since we already
    # fixed template literals above, the remaining ones are JSX.
    # Actually, in JSX context, {expr} IS correct syntax. Let me
    # verify...   {trip.duration_nights > 0 ? " / " + ... : ""}
    # is valid JSX, so these should be fine.
    # ============================================================

    # ============================================================
    # FIX 3: DAYS / NIGHTS uppercase (TripCard) - same pattern
    # ============================================================
    # Already handled by fix 1 if applicable. TripCard uses plain JSX, not template literal.

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed: {filepath}")

print("Done with fixes.")
