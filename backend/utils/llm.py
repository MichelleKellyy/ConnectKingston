import os
import cohere
import json
import re
import ast
co = cohere.ClientV2(os.getenv("COHERE_LLM_API"))

async def match_with_llm_ids(profile, opportunities):
    prompt = f"""
You are a volunteer matching assistant.

User Profile:
Name: {profile['full_name']}
Location: {profile.get('location', 'Unknown')}
Skills: {', '.join(profile['skills'])}
Interests: {', '.join(profile['interests'])}
Availability: {profile.get('availability_hours_per_week', 'Not specified')}

Opportunities:
"""
    for opp in opportunities:
        prompt += f"""
ID: {opp['_id']}
Title: {opp.get('title', 'No title')}
Organization: {opp.get('cause', 'Unknown')}
Description: {opp.get('description', 'No description provided.')[:300]}
Location: {opp.get('location', 'Unknown')}
Availability: {opp.get('availability', 'Not specified')}
"""

    prompt += """
Task: From the above opportunities, select only the IDs of the opportunities
that are most relevant for this user. Return ONLY valid JSON like this:

["<opportunity_id_1>", "<opportunity_id_2>", ...]
"""

    response = co.chat(
        model="command-a-vision-07-2025",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500
    )

    # Extract raw text
    text = getattr(response.message, "content", "")
    if isinstance(text, list):
        text = text[0].text if len(text) > 0 else ""
    text = text.strip()
    matched_ids_raw = text
    print("Raw LLM output:", matched_ids_raw)

    # Parse JSON safely
    try:
        json_match = re.search(r'\[\s*.*\s*\]', text, re.DOTALL)
        if json_match:
            try:
                ids = json.loads(json_match.group(0))
            except json.JSONDecodeError:
                ids = ast.literal_eval(json_match.group(0))
            if not isinstance(ids, list):
                ids = []
        else:
            ids = []
    except Exception:
        ids = []

    return ids, matched_ids_raw
