class Dashboard:
    def generate(self, failures: list) -> str:
        report = "# Failure Intelligence Report\n\n"
        report += "## Failures by Classification\n\n"
        # Aggregate counts
        report += "| Type | Count |\n| --- | --- |\n"
        # Mock data
        report += "| Genuine Bug | 3 |\n"
        report += "| Flaky Test | 7 |\n"
        report += "| Environment | 2 |\n"
        return report