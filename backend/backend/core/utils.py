import hashlib

def generate_easebuzz_hash(data, salt):
    hash_sequence = (
        f"{data['key']}|{data['txnid']}|{data['amount']}|"
        f"{data['productinfo']}|{data['firstname']}|"
        f"{data['email']}|||||||||||{salt}"
    )
    return hashlib.sha512(hash_sequence.encode()).hexdigest().lower()
