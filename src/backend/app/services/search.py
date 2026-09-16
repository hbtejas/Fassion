from ddgs import DDGS


def parse_search_results(search_results: dict[str, list[dict[str, str]]],) -> str:
    # Handle both dict and list inputs
    if isinstance(search_results, dict):
        items_to_parse = search_results.items()
    else:
        raise ValueError("search_results must be a dictionary")

    output_parts = []

    for item_name, results in items_to_parse:
        output = f"{item_name}:\n"

        for i, result in enumerate(results):
            result_num = i + 1
            # Calculate padding for alignment (accounts for "X. " prefix)
            num_width = len(str(result_num)) + 2  # +2 for ". "
            padding = " " * num_width

            for j, (key, value) in enumerate(result.items()):
                if j == 0:
                    output += f"\t{result_num}. {key}: {value}\n"
                else:
                    output += f"\t{padding}{key}: {value}\n"

        output_parts.append(output)

    return "\n".join(output_parts)


def search_item(items: list[str], max_results: int = 5) -> str:
    """ Search for items on internet

    Args:
        items: List of item names.
        max_results: Number of search results to return per item.

    Returns:
        A string of the title, link, and body of each search result for each item.
    """

    search_results = {}
    for item in items:
        search_results[item] = DDGS().text(item, max_results=max_results, timelimit="m", backend="google")
    return parse_search_results(search_results)


def search_ecommerce_products(
    items: list[str],
    platforms: list[str] = ["amazon", "flipkart", "meesho"],
    max_results: int = 3,
) -> str:
    """Search for real fashion products on e-commerce platforms like Amazon, Flipkart, and Meesho.

    Args:
        items: List of fashion item descriptions or keywords to search for.
        platforms: List of platforms to target ("amazon", "flipkart", "meesho").
        max_results: Maximum results to return per item.

    Returns:
        Formatted string containing product title, direct purchase link, platform name, and details.
    """
    site_query = " OR ".join([f"site:{p}.in OR site:{p}.com" for p in platforms])

    output_lines = []
    for item in items:
        query = f"({site_query}) {item}"
        try:
            results = list(DDGS().text(query, max_results=max_results))
            output_lines.append(f"Products for '{item}':")
            for i, r in enumerate(results):
                title = r.get("title", "").strip()
                link = r.get("href", "").strip()
                body = r.get("body", "").strip()
                
                # Determine platform
                lower_link = link.lower()
                if "amazon" in lower_link:
                    platform = "Amazon"
                elif "flipkart" in lower_link:
                    platform = "Flipkart"
                elif "meesho" in lower_link:
                    platform = "Meesho"
                else:
                    platform = "Store"

                output_lines.append(f"  [{platform}] {title}")
                output_lines.append(f"    Link: {link}")
                if body:
                    output_lines.append(f"    Info: {body[:140]}...")
        except Exception as e:
            output_lines.append(f"  Could not retrieve products for {item}: {e}")

    return "\n".join(output_lines)
