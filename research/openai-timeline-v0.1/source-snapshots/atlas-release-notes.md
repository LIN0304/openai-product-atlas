Title: ChatGPT Atlas - Release Notes | OpenAI Help Center

URL Source: https://help.openai.com/en/articles/12591856-chatgpt-atlas-release-notes

Markdown Content:
## March 10th, 2026

Build: 1.2026.63.7

## February 24th, 2026

Build: 1.2026.49

## **Agent Mode**

*   We've reduced 'laziness' of ChatGPT when in Agent Mode. You'll notice in Agent Mode that ChatGPT is now more persistent on repetitive and tedious tasks (e.g. asking the agent to go through hundreds of emails and extracting action items).

## **Improved searching for text on a web page**

*   Now, when you do "Command+F" to find text on a page, if there are no exact matches, you can find similar matches.

## **Bug fixes**

*   Fixed issues with Tab Search and keyboard shortcuts

*   Fixed tab and tab-group bugs: better return behavior after closing tabs, smoother keyboard navigation, improved spacing, and cleaner pickers.

## February 18th, 2026

Build: 1.2026.42.5

## **Revamped Tab Search**

*   We now make it easier to search for your tabs, across the current window and all windows. Click the magnifying glass icon in your tab strip. Use Command+Shift+A as a shortcut

## **New tab organization features incl. auto organize**

*   Auto organize, remove duplicates, and merge all tabs into one window. Auto-organize, when tapped, will have ChatGPT decide how to group your tabs into tab groups, based on browser memories and prompt instructions. You can edit the instructions with "Edit template"

## **Bug fixes**

*   Fixed several focus issues (e.g. focus wouldn’t automatically transfer to the expected element, clicking on a textbox wouldn’t always transfer focus)

*   Made fullscreen mode more reliable so the bookmark bar behaves correctly and transitions feel smoother.

*   Fixed issues with the tab bar that could affect popup windows and profile menu visibility.

*   Improved IME text input for a smoother typing experience for languages like Japanese and Mandarin

*   Reduced background CPU usage and improved performance during long browsing sessions.

*   Fixed bookmark bar display issues and improved compatibility with older imported Chrome data.

*   Improved right-click menu behavior and fixed image loading issues in certain views.

*   Resolved a tooltip timing issue in tab search for a more polished experience.

**Public link to LGPL bundle:**[https://persistent.oaistatic.com/atlas/public/lgpl/1.2026.42.5.tar.gz.](https://persistent.oaistatic.com/atlas/public/lgpl/1.2026.42.5.tar.gz.)

## February 11th, 2026

Build: 1.2026.35

## **Smart quick actions for "Ask ChatGPT" in the top toolbar**

*   Get proactive, personalized suggestions that help you complete your task, right next to Ask ChatGPT button in the tool bar.

## **More relevant suggestions in the "Ask ChatGPT" sidebar**

*   See more relevant suggested prompts above the composer in "Ask ChatGPT" sidebar, tailored to what you are doing.

## **Bug fixes**

*   Fixed a fullscreen mode issue where the bookmark bar could appear as a white strip.

*   Fixed an issue where opening incognito windows could cause crashes.

*   Fixed UI issues in the tab search panel, vertical tabs sidebar, Atlas menu items, and the bookmark bar.

**Public link to LGPL bundle:**[https://persistent.oaistatic.com/atlas/public/lgpl/1.2026.35.4.tar.gz.](https://persistent.oaistatic.com/atlas/public/lgpl/1.2026.35.4.tar.gz.)

## February 4th, 2026

Build: 1.2026.28.6

## **Saved Prompts**

*   Save prompts that you use frequently and reference them anytime in chat. Save a prompt from any chat using the bookmark icon, and you can use it anywhere with "@" or using the bookmarks bar

## **Device Tab on DevTools**

*   For the devs out there: you can now enable device emulation mode in Developer Tools. Switch your view into popular mobile devices and customize the viewport

## **Renaming Tabs**

*   Customize your tabs with tab renaming. Double click or right-click any tab, and give it any name that works for you

## **Smarter agent/chat transition**

*   We’ve improved auto-switching between agent mode and chat. Fewer users should now get stuck accidentally sending chat messages into agent mode.

## **Bug Fixes**

*   Fixed an issue where autofill could remain visible after navigating away

*   Fixed UI flickering issues in bookmarks and the tab bar

*   Fixed intermittent side tab alignment and Find in Page issues

*   Fixed several bugs that caused "Ask ChatGPT" sidebar suggestions to be inaccurate

*   Fixed an issue causing extension permission prompts to not appear in certain cases

*   Fixed picture-in-picture (PiP) continuity issues

**Public link to LGPL bundle:**[https://persistent.oaistatic.com/atlas/public/lgpl/1.2026.28.6.tar.gz.](https://persistent.oaistatic.com/atlas/public/lgpl/1.2026.28.6.tar.gz.)

## January 21st, 2026

Build: 1.2026.15.3

## **Tabs**

*   Tab Groups are now available

*   Fixes for Vertical tab "Mini mode" (when the tab sidebar is very narrow)

*   Simplified tab context menu (right click)

## **Search**

*   "Auto" mode to auto switch between ChatGPT and Google depending on the user query

*   Updated "search result links" UI that more prominently shows search links in answers in a vertical layout

## **Import**

*   Onboarding now prompts Safari importers to install iCloud passwords extension and other improvements on iCloud extension, along with copy changes

## January 15th, 2026

Build: 1.2026.7.7

## **Performance & Stability**

*   Fixed bug to prevent memory over-use

## **Ask ChatGPT sidebar**

*   When sidebar is closed, users will see relevant suggestions on what to ask ChatGPT next

## **Profiles & Settings**

*   Improved Profile Management in Settings

*   Fix a bug where the profile menu button looked blank when the image did not load

*   Ensure settings look appropriate in right-to-left (RTL) languages

*   User material blur background for settings menus

## **Tabs**

*   Show five most recent tabs when Tab Search is empty

*   Command+K as alternate shortcut for tab search

*   Vertical tabs hover tweaks

*   Use themed border for pinned tabs

*   Ensure alert icon stays visible when tabs shrink

## **Address Bar, Find, and Typeahead**

*   Comma-separated numbers work for calculations in address bar (and support for decimal/comma locales)

*   Handle multi-line paste in find panel

*   Fixed bug where typeahead suggestions would break in incognito

## **Shortcuts & window interaction**

*   Show page zoom level banner after page zoom adjustment; clickable UI to adjust

*   Fix possible crash when moving tabs to a new window

*   Allow alternate keyboard shortcuts on websites

*   Allow bookmark bar items to be tapped or command-clicked when window isn't focused

*   Fix back button and forward button layout for RTL languages

## **Import, Downloads & History**

*   Added "Site Data" import from Chrome (cookies and more)

*   Added a sub-menu to "Import from another browser" menu

*   Allow downloads to be dragged / dropped

*   Add favicons to history menu

## **December 18th, 2025**

Build: 1.2025.344.7

## **Multi-profile**

*   For the same ChatGPT login, users can create multiple profiles (i.e. personal, school, work, etc); Each profile can have its own bookmarks, web history, cookies

*   Support for multiple ChatGPT logins is *not* yet supported (coming soon)

## **Import**

*   You can now select individual components to import at any time (not just initial onboarding) → Passwords, Bookmarks, Extensions, History

*   Atlas will notify users if there are parts of onboarding they haven't completed

## **DevTools**

*   Persist size of dev tools per window

*   Pressing any of the keyboard shortcuts for the Dev Tools window (Cmd+Option+I, Cmd+Option+J, Cmd+Option+C) now closes the dev tools window if it's docked.

## **Home Page**

*   Draft prompts on the home page will still be there if you go to another site, then press back

*   Copy and paste fix for devtools

## **Other**

*   Recently Closed Tabs added to History menu

*   Permissions prompt UI polish

*   Fixed bug with tabs getting lost in rare occasions

*   Better back button behavior for tabs opened from tabs

*   Use material blur background for settings menus

*   Possible fix for too-high memory use

## **Shortcuts**

*   Ctrl+Cmd+Left (or Right/Up/Down) now moves the selected tab one space

## **December 9th, 2025**

Build: 1.2025.337.4

## **Onboarding**

*   First time onboarding flow for Ask ChatGPT sidebar

## Bugs

*   Bug fixes for occasional empty chat + search responses

*   Bug fixes for 'all tabs are blank' issue

*   Improved full screen video animation

## **Browser memories**

*   Right click on text on a webpage and select "Ask ChatGPT to remember" to add text from webpages to your ChatGPT memory

## **Dev tools**

*   Copy and paste fix for devtools

## **Vertical tabs**

*   Hover to see tabs: Hover left side of screen to see tabs, when tabs are closed in vertical tabs setting

*   Add tab close button when you're in vertical tabs 'mini' mode (very narrow width)

*   Tab style: Ability to set vertical tabs from "Tab Style" menu in main tabs menu

**Public link to LGPL bundle:**[https://persistent.oaistatic.com/atlas/public/lgpl/1.2025.337.4.tar.gz](https://persistent.oaistatic.com/atlas/public/lgpl/1.2025.337.4.tar.gz).

## **November 25th, 2025**

Build: 1.2025.323.6

## **Developer Tools**

*   Dockable DevTools

## **Chat + Search**

*   User can turn off 'safe search' for search result links (excluding certain geos + u18)

*   Better responses from ChatGPT that incorporate Browser memories

## **November 18th, 2025**

Build Number: 1.2025.316.6

## Tabs

*   **Vertical tabs:** You can now choose vertical tabs as your preferred tab layout. Go to settings > tab style > vertical tabs

*   **Select multiple tabs:** You can also select and drag multiple tabs at once using command click and shift click.

*   **Most recently used tab:** We’ve added a new shortcut to cycle through your most recently used tabs using Control + Tab. Off by default, go to settings > cycle most recent tabs shortcut.

## Chat and search

*   **Default search engine:** Option to set Google as a default search engine. Go to settings > default search engine.

## Ask ChatGPT Sidebar

*   **Insert from Ask ChatGPT sidebar:** We’ve added an "Insert” button in the Ask ChatGPT sidebar when you’re getting writing help and making edits.

*   **Faster responses:** When browser memories are enabled, responses should be faster

## Other updates

*   **Extensions import: Now you can import extensions from your current browser when you download Atlas. Coming soon for existing Atlas users.**

*   **Downloads UI: Now you can more easily see your downloads in Atlas with an improved downloads interface.**

*   **iCloud Passkeys:** Save and use iCloud keychain passkeys.

## New shortcuts

*   Search chats from new tab page - Command + K

*   Open conversation history sidebar from new tab page - Command + Shift + S

*   When in tab search (Command + Shift + A) use Shift + Return to insta-zoom the selected tab to the left of your tab strip.

**Public link to LGPL bundle:**[https://persistent.oaistatic.com/atlas/public/lgpl/1.2025.316.6.tar.gz](https://persistent.oaistatic.com/atlas/public/lgpl/1.2025.316.6.tar.gz).

## **November 5, 2025**

Build Number: 1.2025.302.4

## **Tabs**

Added "Reopen Closed Tab" and "Open Tab" items to context menu

Fixed issues with tab dragging

## **"Ask ChatGPT" sidebar**

Added projects support in sidebar

Context menu support in "Ask ChatGPT" sidebar

Remove hover "close" icon on "Ask ChatGPT" sidebar

## **New Tab Page and Search**

Fixes occasional blank results page after searching after computer re-wake

"Sticky model" option - adds a setting to remember last model selection in new tab page

Add Pulse to the navigation sidebar for eligible users

## **Shortcuts**

Allow websites to use Cmd + R shortcut, especially for Google Sheets

## **Agent**

Animate scrolling for Agent

## **Other improvements**

See all keyboard shortcuts from the "Help" menu

Updated icons

Improved update reliability

Allow exit fullscreen when esc is pressed

Choose folder for bookmark when editing

Accent color applied to more UI elements

More consistent mouse input for Picture-in-Picture windows

## **October 28, 2025**

Build Number: 1.2025.295.4

## **Extensions**

1Password connection to the native app now works (note this requires [adding an additional browser in 1Password MacOS app settings](https://support.1password.com/additional-browsers/?mac#connect-an-additional-browser-to-1password) and restarting Atlas)

1Password extension fixes even without native app

Some buttons that trigger extensions were not working; fixed. 

Fixed opening extension popups on the New Tab page. 

You can now trigger extension actions by clicking items in the extension menu.

## **Login**

Fixed login issue that prevented users from logging in during onboarding.

## **General UI**

Added an option to warn before quitting the app with Cmd+Q (off by default). 

Command+Shift+` now cycles backwards through windows. 

Converting a pinned tab to normal tab no longer has a rendering glitch

Fixed cursor changes when hovering over text views on the homepage.

Tab sharing UI polish

Permission dialogs now clearly state which site is requesting access.

## **Ask ChatGPT sidebar**

Added a model picker

Fixed an issue where the sidebar would not work on pages without a favicon. 

Removed a case where hovering could incorrectly show “0 words” for page contents.

## **Agent**

Agent tasks now use an isolated clipboard separate from your clipboard. 

Improved reliability when pausing and resuming agent mode, and improved browser performance while paused.

## **Input + Accessibility**

Resolved an issue that blocked certain accessibility events.

## **October 23, 2025**

### **IME input (Korean and Japanese)**

We fixed an issue affecting input method editors (IME) when composing characters. Text entry in Korean and Japanese now works as expected in Atlas.

### **History deletion**

Atlas now prompts for confirmation before you delete chat history.

## **October 21, 2025**

ChatGPT Atlas is a new web browser with ChatGPT built in. Available on macOS for Free, Plus, Pro, Go users globally and in beta for Business users. With ChatGPT built into your browser, you can get help anywhere on the web. To get started, visit [chatgpt.com/atlas](http://chatgpt.com/atlas) to download. You can bring your saved passwords, bookmarks, and browsing history from another browser.

Here are some of our key features available in Atlas.

**New tab page**

AskChatGPT a question or enter a URL to see faster, more useful results in one place.

**Smarter searches**

To explore more specific types of results beyond the chat, select from tabs for search links, images, videos, and news (where available).

**Ask ChatGPT sidebar**

Open ChatGPT sidebar on any page to summarize, analyze, or handle tasks directly in the same window.

**In line writing help**

Pull up ChatGPT in any form field to write or edit without switching tabs. Highlight text inside the form field or document and click the ChatGPT logo to get started.

**Browser memories**

If you turn on browser memories, ChatGPT will remember key details from your web browsing to improve chat responses and offer smarter suggestions—like retrieving a webpage you read a while ago. Browser memories are private to your account and under your control. You can view them all in settings, archive ones that are no longer relevant, and clear your browsing history to delete them. Even when browser memories are on, you can decide which sites ChatGPT can’t see using the toggle in the address bar. When visibility is off, ChatGPT can’t view the page content, and no memories are created from it.

**Home page suggestions**

ChatGPT remembers what you’ve explored and suggests what to do next, whether that’s returning to past pages, digging deeper into a topic, surfacing related ideas, or automating routine tasks.

**Agent Mode (Preview)**

Plus, Pro, and Business users can now enable agent mode in Atlas to let ChatGPT do work on your behalf and always under your control. In agent mode, ChatGPT can complete end to end tasks for you like researching a meal plan, making a list of ingredients, and adding the groceries to a shopping cart ready for delivery. You’re always in control: ChatGPT is trained to ask before taking many important actions, and you can pause, interrupt, or take over the browser at any time.

Agent Mode runs also operates under boundaries:

System access: Cannot run code in the browser, download files, or install extensions.

Data access: Cannot access other apps on your computer or your file system, read or write ChatGPT memories, access saved passwords, or use autofill data.

Browsing activity: Pages ChatGPT visits in agent mode are not added to your browsing history.

You can also choose to run agent in logged out mode, and ChatGPT won’t use any pre-existing cookies and won’t be logged into any of your online accounts without your specific approval.

These efforts don’t eliminate every risk; users should still use caution and monitor ChatGPT activities when using agent mode.

**Privacy and data controls**

We’ve made it easy to control and adjust your settings in Atlas. You can clear history for a page or your full history altogether. You can also open an incognito window where you’re signed out of ChatGPT and chats and memory won’t be saved to your account.

By default, we don’t use the content you browse to train our models. If you choose to opt-in this content, you can enable “include web browsing” in your Atlas data controls settings. If you've enabled training for chats in your ChatGPT account, training will also be enabled for chats in Atlas. This includes website content you've attached when using the Ask ChatGPT sidebar and details from browser memories that inform your chats.

**Parental controls**

If a parent has set up parental controls for ChatGPT, these settings will carry over to conversations with ChatGPT in Atlas. We’re also introducing new parental controls in Atlas, including the option for parents to turn off browser memories and agent mode.
