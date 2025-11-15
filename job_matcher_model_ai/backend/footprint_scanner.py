class FootprintScanner:
    def __init__(self):
        pass

    def scan(self, linkedin_url=None, github_url=None, stack_url=None):
        """
        Returns a summary of public footprint
        """
        results = {}
        if linkedin_url:
            results['linkedin'] = f"Scanned LinkedIn: {linkedin_url}"
        if github_url:
            results['github'] = f"Scanned GitHub: {github_url}"
        if stack_url:
            results['stackoverflow'] = f"Scanned StackOverflow: {stack_url}"

        return results
