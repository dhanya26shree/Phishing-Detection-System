from blockchain.ledger import ledger

def check_domain_authenticity(url_or_domain):
    """
    High-level validator that checks the blockchain ledger.
    Returns: (is_verified, metadata)
    """
    # Simple extraction of domain for validation
    domain = url_or_domain.split("//")[-1].split("/")[0].split("?")[0]
    if domain.startswith("www."):
        domain = domain[4:]
    
    is_verified, data = ledger.verify_domain(domain)
    return is_verified, data
