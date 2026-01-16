import os
import cohere
import json
import re
import ast
co = cohere.ClientV2(os.getenv("COHERE_LLM_API"))

def match_with_llm_ids(profile, opportunities):
    prompt = f"""
You are a volunteer matching assistant. You must be HIGHLY SELECTIVE and only match opportunities that truly fit the user's profile.

User Profile:
Name: {profile['full_name']}
Location: {profile.get('location', 'Unknown')}
Skills: {', '.join(profile['skills'])}
Interests: {', '.join(profile['interests'])}
Availability: {profile.get('availability_hours_per_week', 'Not specified')} hours per week

Opportunities:
"""
    for opp in opportunities:
        prompt += f"""
---
ID: {opp['_id']}
Title: {opp.get('title', 'No title')}
Organization: {opp.get('cause', 'Unknown')}
Description: {opp.get('description', 'No description provided.')[:300]}
Location: {opp.get('location', 'Unknown')}
Availability: {opp.get('availability', 'Not specified')}
"""

    prompt += """
---

STRICT MATCHING RULES:
1. The opportunity MUST match at least 2 of: user's skills, interests, or relevant experience
2. DO NOT match everything - be selective
3. Only return 3-7 of the BEST matches
4. If the user has technical skills, DON'T match to general volunteer roles unless technology is needed
5. If the user has specific interests (e.g., healthcare, arts, education), ONLY match opportunities in those areas
6. Generic volunteer roles should only match if the user has general volunteering interests

Task: Analyze each opportunity carefully. Return ONLY the IDs of the 3-7 MOST RELEVANT opportunities.
If fewer than 3 opportunities are truly relevant, return only those.

Output format (ONLY JSON array, no text before or after):
["id1", "id2", "id3"]
"""

    response = co.chat(
        model="command-a-vision-07-2025",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2000
    )

    # Extract raw text
    text = getattr(response.message, "content", "")
    if isinstance(text, list):
        text = text[0].text if len(text) > 0 else ""
    text = text.strip()
    matched_ids_raw = text
    print("Raw LLM output:", matched_ids_raw)
    print("Data type of Raw LLM output:", type(matched_ids_raw))

    # Parse JSON safely
    try:
        json_match = re.search(r'\[\s*.*\s*\]', text, re.DOTALL)
        if json_match:
            try:
                ids = json.loads(json_match.group(0))
                print({"ids in try block":ids})
            except json.JSONDecodeError:
                ids = ast.literal_eval(json_match.group(0))
                print({"ids in except block":ids})
            if not isinstance(ids, list):
                ids = []
        else:
            ids = []
    except Exception:
        ids = []

    return ids, matched_ids_raw
