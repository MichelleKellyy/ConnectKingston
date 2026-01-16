#JUST TESTING CODE THIS WAS TO UNDERSTAND ERROR AS BEFORE I WAS GETTING EMPTY LIST 

import ast
import json

llm_text = '["6967bed5d50f6dfc146c301b", "6967bed6d50f6dfc146c301c", "6967bed6d50f6dfc146c301d", "6967bed6d50f6dfc146c301e", "6967bed6d50f6dfc146c301f", "6967bed6d50f6dfc146c3020", "6967bed6d50f6dfc146c3021", "6967bed6d50f6dfc146c3022", "6967bed6d50f6dfc146c3023", "6967bed6d50f6dfc146c3024", "6967bed6d50f6dfc146c3025", "6967bed6d50f6dfc146c3026", "696838cdd50f6dfc146c33f3", "696838cdd50f6dfc146c33f4", "696838cdd50f6dfc146c33f5", "696838cdd50f6dfc146c33f6", "696838cdd50f6dfc146c33f7", "696838cdd50f6dfc146c33f8", "696838cdd50f6dfc146c33f9", "696838ced50f6dfc146c33fa", "696838ced50f6dfc146c33fb", "696838ced50f6dfc146c33fc", "696838ced50f6dfc146c33"]'

# Try parsing as JSON first
try:
    ids_list = json.loads(llm_text)
except json.JSONDecodeError:
    # fallback: use ast.literal_eval (safer than eval)
    try:
        ids_list = ast.literal_eval(llm_text)
    except Exception:
        ids_list = []  # give up if completely malformed

print(ids_list)
print(type(ids_list))
