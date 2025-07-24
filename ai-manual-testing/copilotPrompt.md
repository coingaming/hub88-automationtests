You are an expert QA analyst. Based on the `rich-analysis.json` file (structured UI data extracted via Playwright from a live webpage), write **manual test cases** in Markdown format to validate:

- Form behavior
- Button and interactive element actions
- Input fields (text, password, checkbox, etc.)
- Accessibility features (aria-labels, roles, alt attributes)

Use `rich-analysis.json` to extract actual UI elements like:

- Input fields with `type`, `placeholder`, and `name`
- Buttons with visible text or `aria-label`
- Elements with roles like `button`, `form`, `textbox`, `checkbox`, `link`

Only write test cases for **visible, interactive elements** (filter `clickable: true` or `tag: input`).

Output everything in **Markdown (.md)** format. Include at least **5–10 test cases** with meaningful variations and thoughtful coverage, creating a file with name related to the url/path provided in `rich-analysis.json`. Use emojis in the titles, make it look good.

Each test case should follow this format:

---

### Test Case ID: TC-001

**Title:** Validate search input functionality  
**Priority:** High  
**Preconditions:**

- User has access to the webpage.
- Browser is opened and navigated to the URL.

**Test Steps:**

1. Locate the input field with `placeholder="Search"`.
2. Enter the text `"Test Search"`.
3. Press Enter or click the associated "Search" button.

**Expected Result:**

- The page navigates to a search results screen with results related to `"Test Search"`.

---

🧾 At the end of the file, include a **summary table** of all test cases like this:

| Test Case ID | Title                                         | Priority | Impact | Likelihood | Covered Elements |
| ------------ | --------------------------------------------- | -------- | ------ | ---------- | ---------------- |
| TC-001       | Validate search input functionality           | High     | 9      | 8          | Input, Button    |
| TC-002       | Check visibility and accessibility of buttons | Medium   | 7      | 6          | Buttons, Roles   |
