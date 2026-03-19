import os

file_path = os.path.join("src", "admin", "AdminTrips.jsx")

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

honeymoon_start = -1
featured_end = -1
insert_idx = -1

for i, line in enumerate(lines):
    if "{/* Honeymoon Section Fields */}" in line:
        honeymoon_start = i
    if "*</span> Price (₹)" in line:
        # The <div className={styles.inputGroup}> is 2 lines above
        featured_end = i - 2 
    if "className={styles.formActions}" in line:
        insert_idx = i - 1

print(f"Honeymoon Start: {honeymoon_start}")
print(f"Featured End: {featured_end}")
print(f"Insertion Point: {insert_idx}")

if honeymoon_start > -1 and featured_end > -1 and insert_idx > -1:
    block = lines[honeymoon_start:featured_end]
    del lines[honeymoon_start:featured_end]
    
    new_insert_idx = insert_idx - len(block)
    
    wrapper_start = ["              {/* Extra Showcase Settings */}\n", "              <div className={styles.formSection}>\n"]
    wrapper_end = ["              </div>\n"]
    
    lines[new_insert_idx:new_insert_idx] = wrapper_start + block + wrapper_end
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Successfully moved showcase fields.")
else:
    print("Could not find the indices.")
