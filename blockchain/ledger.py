import hashlib
import json
import time
import os

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data # This will store { "domain": "google.com", "reputation": "trusted" }
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

class ReputationLedger:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.trusted_domains_dir = "blockchain/data"
        if not os.path.exists(self.trusted_domains_dir):
            os.makedirs(self.trusted_domains_dir)
        self.load_predefined_trust()

    def create_genesis_block(self):
        return Block(0, time.time(), "Genesis Block - PhishShield Trust Root", "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_trust_entry(self, domain, original_owner="System"):
        """
        Calculates hash of a domain and adds it to the ledger.
        In a real SIH project, this would be a distributed consensus.
        """
        data = {
            "domain_hash": hashlib.sha256(domain.lower().encode()).hexdigest(),
            "domain_name": domain, # Storing for easier lookup in this mock
            "status": "verified",
            "timestamp": time.time(),
            "authorized_by": original_owner
        }
        new_block = Block(
            len(self.chain),
            time.time(),
            data,
            self.get_latest_block().hash
        )
        self.chain.append(new_block)
        return new_block.hash

    def verify_domain(self, domain):
        """
        Check if the domain's hash exists in our 'immutable' ledger.
        """
        target_hash = hashlib.sha256(domain.lower().encode()).hexdigest()
        for block in self.chain:
            if isinstance(block.data, dict) and block.data.get("domain_hash") == target_hash:
                return True, block.data
        return False, None

    def load_predefined_trust(self):
        """
        Bootstrapping the ledger with well-known safe domains.
        """
        safe_list = [
            "google.com", "microsoft.com", "apple.com", "paypal.com", 
            "amazon.com", "github.com", "linkedin.com", "facebook.com",
            "twitter.com", "fastapi.tiangolo.com", "python.org"
        ]
        for domain in safe_list:
            self.add_trust_entry(domain)

# Singleton instance
ledger = ReputationLedger()
