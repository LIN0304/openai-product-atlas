Title: ChatGPT Business - Release Notes | OpenAI Help Center

URL Source: https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes

Markdown Content:
## July 6, 2026

## ChatGPT for PowerPoint is now generally available

ChatGPT for PowerPoint is now generally available for Business workspaces. Teams can create and revise editable presentations directly in Microsoft PowerPoint, ask questions about deck structure and narrative, and use Skills and enabled apps to build slides from repeatable workflows and connected sources. Advanced edits and template matching may still require review.

Workspace admins can enable ChatGPT for PowerPoint and control access to supported apps. Business usage remains free through August 6, 2026. After that, usage follows the flexible-pricing model and draws from the workspace credit pool after included usage.

Additionally, as of July 6th Workspace Agent runs now use token-based pricing, with credit use based on input tokens, cached input tokens, and output tokens. Business plans include usage for ChatGPT Workspace Agents, ChatGPT for Excel, and ChatGPT for PowerPoint through the general Codex agentic usage pool as pricing takes effect for each feature. Flexible pricing can extend included limits. [Learn more about ChatGPT for PowerPoint](https://help.openai.com/articles/20001242) and [review the ChatGPT rate card](https://help.openai.com/articles/11481834).

## **June 26, 2026**

## **Simplified controls in the model picker**

We’re rolling out an updated model picker for ChatGPT Business on web, iOS, and Android. It makes it easier to choose the balance of speed and reasoning effort that works best for a task without changing the underlying models or usage limits included with ChatGPT Business.

The picker now includes Instant, Medium, High, Extra High, Pro Standard, and Pro Extended. Medium replaces Thinking Standard, High replaces Thinking Extended, and Extra High replaces Thinking Heavy. Pro Standard and Pro Extended continue to use GPT-5.5 Pro. Thinking Light is no longer available.

Instant can automatically switch to Medium when a request benefits from more reasoning. On iOS and Android, the picker appears at the top of the conversation. On web, it appears in the message composer.

## **Admin controls for plugins for ChatGPT Business**

Workspace admins and owners can now manage plugins from **Workspace settings > Plugins**. This page brings plugin discovery and governance into one surface, including search and filters for status, installation policy, roles, category, and catalog.

Admins and owners can set whether plugins are available for members to install or installed by default for the workspace, view the apps the plugin uses, and manage the plugin from this view. Learn more: [Plugins in Codex](https://help.openai.com/en/articles/20001256-plugins-in-codex)

## **June 25, 2026**

## **Memory improvements for ChatGPT Business**

We’re rolling out improved memory for ChatGPT Business. When memory is enabled, ChatGPT can use relevant context from past chats to keep memory current and make responses more relevant as work changes, rather than relying only on details saved manually.

Users can now:

*   Review a memory summary showing information ChatGPT may use to personalize responses.

*   View Sources below personalized responses to see relevant context from memories, past chats, and custom instructions.

*   Correct memory, delete a referenced chat, mark a source as not relevant, turn memory off, or return to legacy Saved memories.

The memory summary is a high-level view of relevant context and may not include everything ChatGPT can remember or reference.

This update does not affect Codex memory. Project-only memory remains contained within each project and does not use memories or conversations from outside that project. These improvements are available at no additional cost.

Learn more about the

[research](https://openai.com/index/chatgpt-memory-dreaming/)
behind these memory improvements in ChatGPT.

## **Codex Remote GA and DigitalOcean plugin**

Codex Remote is now generally available to users in ChatGPT Business workspaces. From the ChatGPT mobile app, users can start or continue work on a connected Mac or Windows host, review progress, and approve actions from their phone. Remote Control now uses authenticated one-to-one QR pairing between each supported mobile device and each host. Connections used since June 8 remain paired; older inactive connections need to pair again. Signing out turns off Remote Control without removing existing pairings.

The new

[DigitalOcean Droplet Workspace plugin](https://chatgpt.com/plugins/share/5dc672c7116c44ff92595d48e72df522)
is also available to ChatGPT Business users. It lets Codex provision a DigitalOcean Droplet, configure SSH access, and connect it to the Codex app as a remote workspace. Users should update the ChatGPT mobile app and Codex app to the latest versions before connecting.

[Learn more about using Codex with a ChatGPT plan](https://help.openai.com/articles/11369540)
.

## June 19, 2026

## Slack connector actions and OAuth scope approvals

ChatGPT Business workspaces can now use Slack connector actions in ChatGPT when the Slack app is connected and actions are enabled. In addition to searching Slack, users can ask ChatGPT to help take supported Slack actions such as joining a channel, creating a reminder, uploading a file, or updating their Slack profile.

Workspace owners and admins can manage Slack in Apps in ChatGPT, including Action control. Some actions may require additional Slack OAuth scopes or Slack admin approval. If a user tries an action that needs scopes their workspace has not approved, ChatGPT may ask them to reconnect Slack or contact an admin. Learn more in the

[ChatGPT Slack app article](https://help.openai.com/articles/12525822)
.

## June 18, 2026

## Record & Replay in Codex

Record & Replay is a new Codex app feature for macOS that lets eligible Business users demonstrate a workflow once and turn it into a reusable skill. It can help teams capture stable, repeatable workflows that are easier to show than describe, then reuse them with Codex, Computer Use, browser actions, plugins, or a combination of available tools.

Record & Replay requires Computer Use to be available and enabled, and initial availability excludes the European Union, UK and Switzerland. Users should keep recordings focused on the workflow and avoid secrets or sensitive data. Learn more in the

[Record & Replay guide](https://developers.openai.com/codex/record-and-replay)
.

## **June 11, 2026**

## **Codex updates**

We’ve made several Codex updates, including:

*   Eligible Business users can send Codex invitations from the profile menu by choosing **Invite a coworker**, and receive a referral bonus when the recipient joins the workspace and sends their first Codex message. Learn more in [Invite friends and coworkers](https://developers.openai.com/codex/pricing#invite-friends-and-coworkers) and review the [current terms](https://help.openai.com/en/articles/20001271). Admins and owners can use the toggle in **Workspace settings > Permissions & Roles**to control this feature.

*   We added [Developer mode](https://developers.openai.com/codex/app/browser#developer-mode) for Browser use in Chrome and the Codex in-app browser, where available. Developer mode lets Codex use controlled Chrome DevTools Protocol (CDP) access for performance profiling and deeper debugging of network traffic, console output, runtime errors, DOM state, and applied styles. The feature is turned off by default at the user level, and can be enabled from Codex app settings. Admins and owners can turn off the feature from [Codex cloud settings](https://chatgpt.com/codex/cloud/settings/) by accessing the **Policies & Configurations** pane. [Learn more](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan#in-app-browser-developer-mode).

The release also adds /init in the app composer for generating an AGENTS.md scaffold, support for configuring per-app access controls for Computer Use on Windows, clearer usage-limit errors with workspace guidance and reset timing when available, and a new **Unread chats** section in the command menu. [Learn more](https://developers.openai.com/codex/changelog)

## June 2, 2026

## Build and deploy internal websites and apps with ChatGPT Sites

ChatGPT Sites is now available in preview for ChatGPT Business workspaces with Codex access. Available as a plugin, teams can ask Codex to create, iterate on, and deploy lightweight full-stack JavaScript/TypeScript web apps for internal workspace use, with hosted site URLs, Sign in with ChatGPT access and data & file storage storage, while keeping access workspace internal.

Admins and owners can manage enablement and access through workspace settings and RBAC. For Business workspaces, ChatGPT Sites is enabled by default, and can be managed from **Workspace settings > Permissions & Roles.**Admins and owners can disable created sites from **Workspace settings > Sites.**

Learn more:

[Codex Sites developer guide](https://developers.openai.com/codex/sites)
.

## Role-specific plugins in Codex

Role-specific plugins are rolling out in Codex for supported ChatGPT Business workspaces. This first set includes Sales, Data Analytics, Product Design, Creative Production, Investment Banking, and Public Equity Investing. These plugins package role-specific skills, app integrations, starter prompts, and workflow guidance so teams can use Codex for sales prep, analytics and dashboards, prototypes, creative assets, and financial research.

This launch also adds 66 single-app plugins that expand the integrations available in Codex, including tools such as Databricks, Salesforce, Hex, and Clay. Users can add available plugins from the Codex plugin directory, and Codex can help them complete setup. Workspace admins control the underlying app permissions in workspace settings; if a required app is not enabled, the related plugin may not be available.

Learn more:

[Plugins in Codex](https://help.openai.com/articles/20001256)
.

## Active account session controls

We’re rolling out **Active sessions**, a new security feature in ChatGPT that helps users review sessions associated with their account and sign out of sessions they don’t recognize.

**Availability:** This feature is not available for accounts linked to an organization’s SSO sign-in, including SAML or OIDC. This can apply even if the organization does not require SSO for every sign-in, or if the user signed in another way for their current session.

Users with access can now:

*   Review first-party OpenAI sessions from **Settings**>**Security**>**Active sessions**, with available details such as device, app, approximate location, sign-in time, trusted-device status, and whether it is the current session.

*   Log out of individual sessions or all sessions from **Active sessions**

Active sessions shows sessions known through session management, including ChatGPT, Codex, and API Platform sessions where available. It does not manage third-party app sessions, connected apps, Sign in with ChatGPT sessions used only for third-party services, or Codex CLI sessions.

Learn more:

[Managing active sessions in ChatGPT](https://help.openai.com/articles/20001257)

## May 29, 2026

## Codex updates: Computer use and remote control for Windows, usage profiles

Codex now supports Computer Use on Windows in the Codex app. Business users with Codex access can use Computer Use to let Codex see, click, and type in Windows applications. Users can also continue Windows workflows from ChatGPT on iOS or Android, or from Codex on Mac, to check progress, respond to prompts, and steer while away from the desk while the Windows machine remains the host for project files, shell, app server, and local context.

To try Computer Use on Windows, install the Computer Use plugin from the Plugins marketplace and invoke it using the @ mention, or Codex can use it when appropriate for the task.

This release also improves Codex app responsiveness and in-app browser speed, stability, and web compatibility, and adds gradually rolling out Codex profiles for eligible users. Profiles let users review and track their Codex identity, activity over time, profile details, usage stats, and token activity.

Computer Use on Windows is unavailable in the European Economic Area, the United Kingdom, and Switzerland at launch.

Learn more: [Computer Use](https://developers.openai.com/codex/app/computer-use), [Remote control](https://developers.openai.com/codex/remote-connections), [Profiles](https://developers.openai.com/codex/app/settings#profile).

## May 28, 2026

## App templates for GitHub Enterprise, Snowflake, and Databricks

Workspace admins and owners on Business plans can now use ChatGPT app templates to create workspace-specific apps for GitHub Enterprise, Snowflake, and Databricks. App templates provide a guided setup flow for provider-specific configuration such as OAuth credentials, callback URLs, webhook details, managed MCP server URLs, and workspace access controls before admins publish the app to members.

Use the new setup guides to understand the general app-template flow and the provider-specific steps for each template: [ChatGPT app templates](https://help.openai.com/articles/20001247), [GitHub Enterprise app template](https://help.openai.com/articles/20001248), [Snowflake app template](https://help.openai.com/articles/20001249), and [Databricks app template](https://help.openai.com/articles/20001250).

After publishing, admins can manage the resulting app from Workspace settings > Apps > Enabled, including role access, action controls, and action confirmation.

## New controls and capabilities for ChatGPT workspace agents

We’re rolling out new model, app access, and response capabilities for workspace agents in ChatGPT Business.

Workspace agents now support:

*   GPT-5.5 and reasoning effort controls: When building an agent, creators can choose GPT-5.5 and set the reasoning effort the agent uses. We’ve also improved response speed across agents.

*   Guided agent setup: ChatGPT now asks setup questions to help users create useful agents more quickly.

*   Speech output: Agents can now create audio files as part of their responses.

*   Smarter Slack thread replies: Agents used in Slack can respond to relevant follow-up messages in a thread after the initial mention. Creators can choose whether an agent responds to relevant thread messages or only when it is mentioned.

## May 21, 2026

## Codex updates: richer context, shared plugins, goal mode, browser improvements, remote locked use, and analytics

Codex now gives teams more ways to bring context into longer workflows, reuse internal tools, and track adoption:

*   [Appshots](https://developers.openai.com/codex/appshots) in the macOS app let users attach an app window to a Codex thread with a hotkey, including a screenshot and available text.

*   [Goal mode](https://developers.openai.com/codex/prompting#goal-mode) is generally available across the Codex app, IDE extension, and CLI, so users can define an outcome and success criteria and let Codex keep working toward it.

*   [In-app browser annotations](https://developers.openai.com/codex/app/browser#styling-feedback) support more precise styling feedback for browser-based and frontend work.

*   [Locked computer use](https://developers.openai.com/codex/app/computer-use#locked-use) lets users keep Codex working remotely and securely after the Mac locks, subject to existing regional constraints. Admins and owners can turn this feature off by setting `remote_computer_use = false` in the [Policies & Configurations](https://chatgpt.com/codex/cloud/settings/policies) setting in Codex cloud. Review [configuration reference](https://developers.openai.com/codex/config-reference#requirementstoml) for more details.

*   [Browser-use improvements](https://developers.openai.com/codex/app/browser) add advanced annotation mode, faster asset extraction, read-only JavaScript context, tab grouping usability, less Chrome extension tab clutter, and reliability improvements.

*   [Plugin sharing](https://developers.openai.com/codex/plugins/build#share-a-local-plugin-with-your-workspace) lets ChatGPT Business users share locally built plugins with workspace members from the Codex app so teams can reuse internal tools and workflows. Shared plugins stay within the workspace and organization boundary, appear under Shared with you, and can be disabled by admins and owners with `plugin_sharing = false` in the [Policies & Configurations](https://chatgpt.com/codex/cloud/settings/policies) setting in Codex cloud. Review [configuration reference](https://developers.openai.com/codex/config-reference#requirementstoml) for more details.

*   The [global admin console](https://help.openai.com/en/articles/12289294-global-admin-console#analytics) now includes Codex analytics, with active users, credits and tokens, threads and turns, user leaderboards, plugin usage, accepted lines of code, model usage, and a console-aligned UI.

Learn more: [plugin sharing](https://developers.openai.com/codex/plugins/build#share-a-local-plugin-with-your-workspace), [appshots](https://developers.openai.com/codex/appshots), [goal mode](https://developers.openai.com/codex/prompting#goal-mode), [locked computer use](https://developers.openai.com/codex/app/computer-use#locked-use), and [in-app browser annotations](https://developers.openai.com/codex/app/browser#styling-feedback).

## Workspace agents are now generally available in ChatGPT Business, Enterprise, and Edu.

Workspace agents help teams get more done together across tools. They can own entire workflows on their own, follow team processes, and be shared across your team so people can build once and use together.We’ve also added new admin controls and visibility:

*   Agent builders can set safeguards on which actions agents can take for each app enabled in their workspace.

*   Admins can view workspace agent activity and usage in the [admin console](https://admin.openai.com/).

We’ve extended the free period for workspace agents until July 6, 2026. Credit-based pricing will begin on that date.

## May 14, 2026

## Codex remote access and access tokens for automation

Teams can now use the ChatGPT mobile app to stay connected to Codex work running on a host Mac, making it easier to answer questions, redirect work, approve actions, review outputs, and keep longer-running tasks moving when away from the host machine. The mobile experience reflects the live state of the connected environment, including project context, approvals, screenshots, terminal output, diffs, and test results.

Codex also adds access tokens for trusted, non-interactive local workflows, so approved automation can run through scripts, schedulers, or private CI runners with a ChatGPT workspace identity.

Codex in the ChatGPT mobile app is rolling out in preview on iOS and Android across all plans, including Business, in supported regions. To try it, update both the ChatGPT mobile app and the Codex app on macOS. Mobile setup begins in the Codex App on the host and may require Remote Control access to be enabled for the workspace.

Learn more in [Remote connections](https://developers.openai.com/codex/remote-connections) and [Access tokens](https://developers.openai.com/codex/enterprise/access-tokens).

## May 6, 2026

## Analytics and Agents in the global admin console

The global admin console now includes new Analytics and Agents areas. Analytics gives admins a consolidated view of adoption and usage, with trend views for active users and message activity plus drilldowns for GPTs, projects, skills, users, tool interactions, connector interactions, and workspace health.

Agents gives admins a consolidated view of workspace agents across the organization. Admins can open an agent to review details such as Agent ID, recent activity, connected apps, memory files, schedules, and agent analytics such as unique users and runs over time, or move into Builder to edit it. Workspace Owners can access these views from the global admin console. [Learn more](https://help.openai.com/en/articles/12289294-global-admin-console).

## May 5, 2026

## ChatGPT for Excel and Google Sheets

ChatGPT for Excel and Google Sheets is now available globally for ChatGPT Business, giving teams a spreadsheet-native ChatGPT sidebar in Excel and Google Sheets for building, cleaning up, updating, and explaining workbooks. It supports Skills and apps where available, so spreadsheet work can use approved files, systems, and data sources from a user’s ChatGPT account.

Business customers have a free preview through June 2, 2026; after that, usage follows plan credits and usage terms. Admins can enable ChatGPT for Excel and Sheets in workspace settings and enable apps in the admin portal; app availability may depend on entitlements, admin settings, and source permissions. [Learn more](https://help.openai.com/articles/20001063).

## April 22, 2026

## **ChatGPT Workspace Agents for Enterprise and Business**

ChatGPT workspace agents are rolling out gradually over the next few weeks to ChatGPT Business workspaces.

Workspace Agents let organizations build and use agents for repeatable tasks and automate business workflows leveraging all your connected apps & can run in ChatGPT and/or Slack. Workspace agents can be created, previewed before publishing, shared within a workspace, and run on a schedule.

Eligible workspaces can now:

*   Create agents from templates or build from scratch.

*   Connect agents to tools and apps such as Google Drive, Google Calendar, Slack, and SharePoint.

*   Add skills, files, and custom MCP servers.

*   Share agents privately, by link, or in the workspace directory.

*   Schedule recurring runs in ChatGPT.

*   Use agents in connected Slack channels.

*   View version history and analytics for agents.

Workspace admins can also manage access to agent building, publishing, and Slack usage through admin controls. ChatGPT workspace agents are on by default at launch.

## Data Residency for apps with sync in Japan

All apps with sync now support in-region data residency in Japan for eligible ChatGPT Business workspaces. Previously, in Japan, data residency for apps with sync was limited to Google Drive and GitHub. This launch extends Japan data residency support to all sync connectors. Learn more about [data residency](https://help.openai.com/en/articles/9903489-data-residency-and-inference-residency-for-chatgpt).

## April 20, 2026

## Simplified app action controls

Workspace owners and admins can now manage app actions with a simplified model in **Workspace settings > Apps**. In **Action control**, admins can choose whether an app allows all actions, allows only read actions, or uses a custom configuration for current actions.

Admins can also choose how actions added later are handled by enabling all new actions, enabling only new read actions, or disabling new actions until they are reviewed. This makes it easier to manage app permissions while keeping granular control when needed.

Owners and admins may want to review currently enabled apps, RBAC access, and app action settings to confirm that each app's policy matches their workspace needs. For more information, see: [Admin Controls, Security, and Compliance in apps (Enterprise, Edu, and Business)](https://help.openai.com/articles/11509118)

## **April 16, 2026**

## **Workspace analytics for Business**

A refreshed analytics experience, entitled **Workspace analytics**, is now available for ChatGPT Business. Workspace analytics replaces User analytics with a simpler, workspace-level view that helps admins understand overall adoption and Codex usage across their organization.

Key highlights:

*   **Refreshed analytics experience:** Updated visuals and navigation with a streamlined dashboard built for quick review of workspace activity.

*   **Workspace summary metrics:** View headline metrics such as active users, total messages sent, and total credits spent across the selected time range.

*   **Member-level usage table:** See usage by workspace member, including seat type, credits spent, and messages sent.

*   **Flexible date ranges:** Analyze activity across preset windows including 7 days, 1 month, 6 months, 12 months, or a custom range.

*   **Codex visibility:** Jump directly to Codex analytics for lightweight insights into credits usage and developer activity.

*   **Search and filtering:** Quickly find specific members and review individual usage patterns.

## April 8, 2026

## Outlook shared mailbox and shared calendar actions

The Outlook Email and Calendar apps for ChatGPT now support more delegated Outlook workflows for teams. With the right Microsoft permissions, users can ask ChatGPT to list and read shared mailbox messages, browse shared mailbox folders, mark shared mail read or unread, move shared messages, and send plain-text email from or on behalf of a shared mailbox. ChatGPT can also create, update, respond to, cancel, delete, and attach small files to events on shared Outlook calendars.

Workspace owners and admins should review the Outlook app's action controls before enabling newly added actions. Users who previously connected Outlook may need to reconnect after the workspace enables the new actions; Microsoft Entra approval may also be required. [Learn more](https://help.openai.com/en/articles/12512241).

## April 2, 2026

## New Codex seats in ChatGPT Business

We're introducing a new seat type: a Codex seat based on flexible, credit based pricing. Codex seats have no fixed cost per month, and provide access to Codex only - they do not include ChatGPT workspace access. There's no minimum number of Codex seats you need to purchase, but because seats are billed on usage, using Codex requires [workspace credits](https://help.openai.com/en/articles/20001106-codex-rate-card).

Read about

[Codex seats](https://help.openai.com/en/articles/8792828-what-is-chatgpt-business#codex-seats-usage-based-no-fixed-cost)
, how to

[add or change](https://help.openai.com/en/articles/8542216-managing-members-seat-types-and-roles-in-chatgpt-business#invite-members)
them, and

[billing implications](https://help.openai.com/en/articles/8792536-managing-billing-and-seats-in-chatgpt-business#billing-for-codex-seats-and-credits)
. If you’re new to ChatGPT Business, get started with

[What is ChatGPT Business?](https://help.openai.com/en/articles/8792828)
For a limited time, eligible ChatGPT Business workspaces can earn up to $100 in Codex credits per newly added Codex seat after that member sends their first Codex message, up to $500 per workspace. Learn more in

[Codex for Business promotion: earn up to $500 in credits](https://help.openai.com/en/articles/20001150-codex-for-teams-promotion-earn-up-to-500-in-credits)
.

Along with this change, we're reducing the price of subscription-based ChatGPT seats by USD $5 / month (actual reduction may depend on pricing in your region).

If you're a current subscriber, the new, lower price will be reflected in your next monthly or annual bill. We're refunding the pro-rated price difference on your current bill as a credit that can be applied to your next subscription renewal to account for the price change. Learn more

[here](https://help.openai.com/en/articles/8792536-managing-billing-and-seats-in-chatgpt-business#refunds-and-cancellations)
.

Lastly, we've updated the Codex Rate Card to align with token-based usage pricing. This may result in a difference in what you're charged. Read more in the [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card). ChatGPT rates remain unchanged.

## March 27, 2026

## Updated Box, Notion, Linear, and Dropbox apps

We’re rolling out updated [Box](https://help.openai.com/en/articles/12368225-box-app-with-sync), [Notion](https://help.openai.com/en/articles/12532955-notion-app-with-sync), [Linear](https://help.openai.com/en/articles/12526595-linear-app-with-sync), and [Dropbox](https://help.openai.com/en/articles/12364275-dropbox-app-with-sync) apps in ChatGPT Business. These updates add new app actions, including new write capabilities where supported, and bring the latest app experience into ChatGPT.

These apps are enabled automatically, and workspace admins/owners can review app actions in **Workspace settings > Apps**to enable those aligned to their workspace needs. Additionally, new actions may involve updated scopes - admins/owners should check the [Box](https://help.openai.com/en/articles/12368225-box-app-with-sync), [Notion](https://help.openai.com/en/articles/12532955-notion-app-with-sync), [Linear](https://help.openai.com/en/articles/12526595-linear-app-with-sync), and [Dropbox](https://help.openai.com/en/articles/12364275-dropbox-app-with-sync) app pages for details, and authorize any new scopes required to support new actions (such as write actions). New users may not be able to connect these apps until the scope authorizations are met, or actions are enabled/disabled in alignment with authorized scopes.

Members who previously connected these apps may need to reconnect the app after admin review to start using the updated experience.

## March 26, 2026

## Plugins in Codex

Codex now includes a curated plugins directory that lets users discover, install, and use packaged workflows built from apps and skills directly in Codex. Plugins are installable bundles for reusable Codex workflows, making it easier to share the same setup across projects or teams. Plugins can package skills, optional app integrations, and MCP server configurations in a single place. [Learn more](https://developers.openai.com/codex/plugins).

Plugin availability follows workspace app controls, so if the underlying app is disabled, the matching plugin can also be unavailable. Workspace owners can manage app access in Workspace settings → Apps.

## **March 25, 2026**

## **Google Drive app unification**

Google’s file apps in ChatGPT are now unified under Google Drive, providing a single app experience for interacting with your Google Docs, Sheets and Slides on Google Drive.

The new Google Drive actions are on by default for Business workspaces. Admins/owners can review and manage actions from **Workspace settings > Apps.**Locate the Google Drive entry and click **Manage actions**.

Existing users of Google Drive, Docs, Sheets and Slides apps are unaffected - previously connected apps continue to work. To take advantage of the unified experience, existing users can disconnect and reconnect the Google Drive app to start using the new actions within ChatGPT. New users can connect to the Google Drive app to use Docs, Sheets and Slides actions, without needing to connect the separate apps.

Google Workspace admins may need to re-authorize Google scopes corresponding to app actions - otherwise, users may hit connection errors when trying to connect. [Read more.](https://help.openai.com/en/articles/10408842-google-app-for-chatgpt-data-controls-faq)

## March 19, 2026

## Legacy deep research mode deprecation notice

The legacy deep research mode will be removed on Thursday, March 26, 2026. This change only affects the legacy mode; the current deep research experience will remain unchanged.

Historical conversations and results will remain accessible.

To learn more about deep research, see: [Deep research in ChatGPT](https://help.openai.com/articles/10500283).

## **March 13, 2026**

## **Write actions for Microsoft and Google apps in ChatGPT**

We've updated scopes and actions in Google and Microsoft apps in ChatGPT to include support for write actions. You can now use apps like Microsoft Outlook email to draft emails for you, Google docs and sheets to create spreadsheets or docs, or setup meetings using the respective calendar apps.

Write actions remain disabled by default until workspace admins enable them in **Workspace settings > Apps > Manage actions** for each app. For Microsoft apps, some customers may also need Microsoft Entra admin approval for updated scopes before new users can connect successfully. Learn more in the Help Center: [Apps in ChatGPT](https://help.openai.com/en/articles/11487775), [Google App for ChatGPT - Data Controls FAQ](https://help.openai.com/en/articles/10408842-google-app-for-chatgpt-data-controls-faq), [Outlook Email and Calendar app for ChatGPT](https://help.openai.com/en/articles/12512241-outlook-email-and-calendar-app-for-chatgpt), and [Microsoft Teams app for ChatGPT](https://help.openai.com/en/articles/12552368-microsoft-teams-app-for-chatgpt).

## **March 11, 2026**

## **Updated scopes for Microsoft apps**

We updated the scopes requested by the [Outlook Calendar](https://help.openai.com/en/articles/12512241), [Outlook Email](https://help.openai.com/en/articles/12512241), [Microsoft SharePoint](https://help.openai.com/en/articles/12143177) and [Microsoft Teams](https://help.openai.com/en/articles/12552368) apps to support additional actions. Microsoft Entra admins will need to review and approve the updated app scopes before new users connect - users may hit connection issues, otherwise.

Note that the new scopes do not automatically make available (or enable) new actions for these apps (including any write actions). Workspace admins and owners will need to review available app actions by locating the app entry in **Workspace settings > Apps**, and then clicking **Manage actions**.

New actions, when made available, are disabled by default - admins/owners can review and then enable actions if appropriate for their workspace.

## **March 4, 2026**

## **Codex app on Windows**

Codex app is now available on Windows for ChatGPT Business workspaces that include Codex. It gives members a Windows desktop surface for running multiple Codex agents in parallel, with isolated worktrees, reviewable diffs, and interoperability with Codex in the CLI and IDE.

Members can sign in with ChatGPT from the app to start work from a Windows environment, and admins do not need to configure a separate app-specific permission model. The app uses the same workspace controls as other Codex surfaces. Learn more: [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan).

## **February 25, 2026**

## **Add sources to your projects from anywhere**

Projects now make it easy to build a living knowledge base by adding sources wherever your context already lives; from apps, conversations, or quick text inputs.

*   **Sources from apps:** Paste a link to a Slack channel or Google Drive file or folder to add it directly as a project source.

    *   Additionally, use connected apps directly in chats.

*   **Sources from chats:** Save useful ChatGPT responses into your project so great outputs become reusable knowledge.

*   **Ad-hoc text sources:** Paste notes, briefs, or reference material directly to capture context instantly.

Learn more about [projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt).

## February 2, 2026

## Introducing the Codex App

Today we’re releasing the Codex app for MacOS, a command center for managing multiple coding agents in parallel. The app lets you run long‑horizon and background tasks, review clean diffs from isolated worktrees, see agent progress and decisions, and execute reusable skills and automations.

The Codex app follows the same admin controls as Codex local and Codex cloud. Codex local must be enabled for members to use the Codex app. Admins/owners can control Codex access from [Workspace settings](https://chatgpt.com/admin/permissions) -> Permissions & roles.

We’re also introducing a limited time promotion - Business users receive 2x Codex rate limits. Get started by [downloading](https://chatgpt.com/codex) the macOS app, and [learn more](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) about Codex.

## December 18, 2025

## Introducing the app directory in ChatGPT

You can now browse and add approved apps in the new [**app directory**](https://chatgpt.com/apps). Apps let you work with your tools and data directly inside a conversation—from interactive in-chat experiences to secure connections that allow ChatGPT to search and reference information from third-party services.

As part of this update, [**connectors now appear in the directory as apps**](https://help.openai.com/en/articles/11487775-apps-in-chatgpt), making it easier to manage all your tools in one place. References across the Help Center have been updated to reflect this new terminology.

For ChatGPT Business users, apps are enabled by default. Admins and owners can control which apps are available for their workspace and set which actions each app is allowed to take through

[workspace settings](https://chatgpt.com/admin/ca)
.

Apps are available to all logged-in ChatGPT users, with availability and functionality varying by plan and region. Some apps or capabilities may not be available in certain regions (including the EEA, GB, or Switzerland) or may require specific plan tiers.

Starting today,

[developers can submit apps for review and publication](https://openai.com/index/developers-can-now-submit-apps-to-chatgpt/)
in the app directory, making approved apps available to a broader set of ChatGPT users.

## December 15, 2025

## Apps & connectors admin UI refresh

We’ve refreshed the Apps & connectors section in Workspace settings for admins and owners with a clearer layout: tabs for Enabled, Available, and Draft; a streamlined list view; search and filters; and bulk actions like selecting multiple apps to manage roles or disable. Enabling actions, including sync where supported, now live directly in each connector’s listing.

Available to ChatGPT Business admins in [Workspace settings](https://chatgpt.com/admin/ca). Note that Apps and connectors are enabled by default for Business plans. Read more about [apps](https://help.openai.com/en/articles/12503483-apps-in-chatgpt-and-the-apps-sdk) and [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## December 3, 2025

## Atlassian Rovo MCP connector

We’re adding Atlassian Rovo to our list of MCP connectors, which brings in your Jira, Compass, and Confluence information to bring relevant project context into your chats. This connector enables you to take supported write actions in Jira right from ChatGPT — such as creating issues and triggering workflows—based on what you request and on patterns identified in your project data. All actions are initiated, approved and completed directly in chat.

Admins can review actions and other basic information about the connectors in **Workspace settings → App.** Users can add the Atlassian Rovo from **Settings → Apps & Connectors**.

The Atlassian Rovo connector is available to Enterprise, Edu, Business, Pro and Plus customers with connectors enabled for their workspace.

## November 24, 2025

## New MCP connectors available today

We’re rolling out a new set of MCP access connectors built by partners and reviewed by OpenAI, including **Amplitude, Fireflies, Vercel, Monday.com, Stripe, Hex, Egnyte, Alpaca, BioRender, Semrush, and Jam.dev**. This is available to Enterprise, Edu, Business, Pro and Plus customers with connectors enabled for their workspace. These connectors expand the set of tools customers can bring into ChatGPT and will be followed by additional connectors on a rolling basis.

The connectors released today are **access connectors**, which fetch content when a user asks a question, built using MCP. Connectors remain default off for Enterprise plans, and default on for Business plans.

Admins can review **Actions**and other basic information about these connectors in **Workspace settings → Apps**.

## November 19, 2025

## Custom connectors in company knowledge

Starting today, company knowledge will support custom MCP connectors with search/fetch functionality. Custom connectors fitting this criteria that are enabled for your organization will appear in the company knowledge experience for users that have enabled them for allowed users, giving your team a more complete, accurate, and company-specific context when using the feature.

Admins/owners can continue to manage access to custom connectors in Workspace settings.

Learn more about [company knowledge](https://help.openai.com/en/articles/12628342-company-knowledge-in-chatgpt-business-enterprise-and-edu) and [custom MCP connectors](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta).

## November 13, 2025

## Apps & Apps SDK now available to Business plans

ChatGPT Business customers will now have access to ChatGPT apps. Apps include interactive interfaces – like presentations, maps, and playlists – that respond to natural language and adapt to your conversation. You can start with a bulleted outline and ask Canva to turn it into a professional presentation, or turn a rough sketch into a FigJam diagram—all without leaving ChatGPT.

Our pilot partners—like Figma, Canva, Booking.com, Coursera, Expedia, Spotify, and Zillow—will be available to Business customers in markets where their services are offered, starting in English, with more apps coming.

You can also build your own apps with the [Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk), then test and deploy it for your team using [developer mode](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta).

Learn more: [Apps in ChatGPT and the Apps SDK](https://help.openai.com/en/articles/12503483-apps-in-chatgpt-and-the-apps-sdk) and [Build with the Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)

## Synced Connector Updates

ChatGPT Business workspaces can now use ChatGPT connectors for [Azure Boards](https://help.openai.com/en/articles/12628387-azure-boards-synced-connector), [Basecamp](https://help.openai.com/en/articles/12628389-basecamp-synced-connector), and [Zoho CRM](https://help.openai.com/en/articles/12825765-zoho-crm-synced-connector) These connectors deliver faster, higher-quality answers–especially for knowledge-heavy prompts like strategy summaries, policy lookups, and internal research.

For Business workspaces, connectors are enabled by default—though Admins and Owners can disable specific connectors at any time from their [Workspace connectors settings](https://chatgpt.com/admin/ca). Individual users can connect enabled connectors they want to use from Settings > Apps & Connectors. Once enabled, ChatGPT will automatically reference the indexed content when relevant. Learn more about how to use connectors [here](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## October 27, 2025

## Synced Connector Updates

ChatGPT Business workspaces can now use ChatGPT connectors for [Aha!](https://help.openai.com/en/articles/12628380-aha-synced-connector), [Asana](https://help.openai.com/en/articles/12628359-asana-synced-connector), [ClickUp](https://help.openai.com/en/articles/12628397-clickup-synced-connector), [GitLab Issues](https://help.openai.com/en/articles/12628403-gitlab-issues-synced-connector), [Help Scout](https://help.openai.com/en/articles/12628422-help-scout-synced-connector), [Teamwork.com](https://help.openai.com/en/articles/12628436-teamwork-synced-connector), and [Zoho Desk](https://help.openai.com/en/articles/12628448-zoho-desk-synced-connector). These connectors deliver faster, higher-quality answers–especially for knowledge-heavy prompts like strategy summaries, policy lookups, and internal research.

For Business workspaces, connectors are enabled by default—though Admins and Owners can disable specific connectors at any time from their [Workspace connectors settings](https://chatgpt.com/admin/ca). Individual users can connect enabled connectors they want to use from Settings > Apps & Connectors. Once enabled, ChatGPT will automatically reference the indexed content when relevant. Learn more about how to use connectors [here](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## October 23, 2025

## Company knowledge in ChatGPT

Company knowledge lets ChatGPT use your organization’s context from your connected apps to give answers specific to your company and projects, with clear citations and links back to the original sources. It works across supported connectors like Slack, SharePoint, Google Drive, GitHub, HubSpot, Asana, and more, and respects each user’s existing permissions.

To get started, open a chat, select company knowledge under the message composer, and ask your question; ChatGPT will search your connected tools and show cited results. Learn more in our help center article on[company knowledge for ChatGPT](https://help.openai.com/en/articles/12628342-company-knowledge-in-chatgpt-business-enterprise-and-edu).

## October 17, 2025

## Build, upload, and publish MCP connectors in ChatGPT [Beta]

We’re rolling out full Model Context Protocol (MCP) support with developer mode so your organization can build, test, and publish MCP-powered [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) with read/write capabilities that let ChatGPT take action in your tools. Kick off workflows, create project management tasks, update your CRM, or combine connectors for more complex orchestrations.

Admins can review and publish connectors to the workspace. Build your own MCP connector, or upload trusted third party connectors.

Learn more in our [Help Center article](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta).

## October 16, 2025

## Updated Workspace settings

We’ve updated Workspace settings to make administration clearer and faster. A new **General** tab now centralizes workspace customization (name, logo, appearance, and workspace-wide instructions).

We’ve also streamlined navigation by combining Identity & provisioning with IP allowlists into a new **Identity & access tab**, and by renaming Settings & permissions to **Permissions & roles.**

## October 13, 2025

## Introducing the ChatGPT app and ChatGPT connector for Slack

We’re rolling out two new ways to bring Slack and ChatGPT together: a [connector](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) that brings your Slack context into ChatGPT, and a ChatGPT app for Slack – an integration that enables you to chat with ChatGPT from inside Slack.

With the[**ChatGPT app for Slack,**](https://intercom.help/openai/en/articles/12462158-chatgpt-app-for-slack) you can chat one-on-one with ChatGPT in a dedicated Slack sidebar – a space to ask questions, summarize long threads into action items, draft replies, and search messages and files you already have access to. Chats you start in Slack also appear in your ChatGPT sidebar, so it’s easy to pick up later from web or mobile. Semantic search is supported for Slack customers with AI enabled on Business+ or Enterprise+ plans; all other plans use keyword search.

With the [**ChatGPT connector for Slack**](https://intercom.help/openai/en/articles/12525822-chatgpt-connector-for-slack)**,**you can securely bring in context from your Slack channels and DMs, making responses more helpful Available in chat, Deep Research, and Agent Mode. The connector is enabled by default for Business customers, and users can enable from **Settings > Apps & Connectors**.

Both app and connector are available to **Plus, Pro, Business and Enterprise/Edu** customers. Additionally, the ChatGPT app for Slack requires a **paid Slack account;** availability and workspace installation may depend on your Slack workspace settings.

Installing the app requires the connector to be enabled for your account.

Visit the [**ChatGPT app for Slack**](https://intercom.help/openai/en/articles/12462158-chatgpt-app-for-slack)page to get started with installation.

We additionally added the [Intercom synced connector](https://help.openai.com/en/articles/12562556-intercom-synced-connector), which allows you access and interact with your Intercom data—including conversations, tickets, and help center content.

## October 9, 2025

## Adding Notion and Linear synced connectors

We’re adding [**Notion**](https://help.openai.com/en/articles/12532955-notion-synced-connector) and [**Linear**](https://help.openai.com/en/articles/12526595-linear-synced-connector) as synced connectors, so teams can securely bring Notion pages and Linear issues/discussions into Chat for fast answers and summaries. Both connectors are managed in [**Admin connectors settings**](https://chatgpt.com/admin/ca), in the **Synced connectors** section. Users can enable sync from their **Connector settings**. Once synced, ChatGPT will automatically reference the indexed content when relevant. Learn more about ChatGPT [synced connectors](https://help.openai.com/en/articles/10847137-chatgpt-synced-connectors).

## October 6, 2025

## Updates to Codex

We’re rolling out new Codex capabilities to help teams work and build better: [Codex now works in Slack](https://developers.openai.com/codex/integrations/slack), and supports programmatic control through the [Codex SDK](https://developers.openai.com/codex/sdk). We’ve also added new admin controls and analytics so workspace admins can manage Codex Cloud environments, set safe defaults for CLI/IDE usage, and monitor usage with improved dashboards. Additionally, [Codex rates](https://help.openai.com/en/articles/11481834-chatgpt-rate-card#h_e8c3d8c100) have been updated.

For more information, review our Help Center article on [Codex](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan), and the [Codex developer documentation](https://developers.openai.com/codex).

## September 25, 2025

## Introducing project sharing

Today, we’re announcing an update to [projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt). Now you can share projects with teammates in your workspace, adding files and instructions together to guide ChatGPT’s responses toward a shared goal. Members can chat with the project’s context to stay on the same page as new information gets added and create work that stays consistent in tone.

Shared projects are ideal for ongoing work like client management, content creation, reporting, and research.

Invite members in your workspace by individual email, group email, or shared link. Add/remove project members, set project access permissions, create new chats, add/remove files, and allow members to bring existing chats into the project. Memory is project-only, ensuring sensitive data stays safely within the project.

For more information, see our help center article on [project sharing](https://help.openai.com/en/articles/10169521-projects-in-chatgpt#h_e8f291686b).

## September 15, 2025

## Introducing GPT-5-Codex

We’re adding GPT-5-codex, a GPT-5 variant optimized for agentic coding in Codex. It’s available everywhere you use Codex: default for cloud tasks and code review, and selectable for local workflows via the Codex CLI and IDE extension. Use GPT-5-codex for coding-focused work in Codex, or Codex-like environments; use GPT-5 for general, non-coding tasks. Please review the [announcement](https://openai.com/index/introducing-upgrades-to-codex/) blog for more information.

_Note: GPT-5-Codex is not currently supported in ChatGPT or the API._

To learn more about Codex, visit the [developers site](http://developers.openai.com/codex) as well as our general help article: [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540).

## September 4, 2025

## Updates to Codex

Starting today, Business plans using [flexible pricing](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) can purchase credits to increase access to local tasks above the provided limits. Please refer to the [ChatGPT rate card](https://intercom.help/openai/en/articles/11481834-chatgpt-rate-card) for more information.

## September 3, 2025

## Sharepoint synced connector

ChatGPT Business workspaces can now use the [**Sharepoint synced connector**](https://help.openai.com/en/articles/10847137-chatgpt-synced-connectors-faq), which enables workspace members to securely ask questions and get answers directly from their OneDrive and SharePoint files. Connections can be created, deleted, or modified at any time. Once enabled, ChatGPT will automatically reference your SharePoint content when relevant.

Workspace Admins must enable access to the Sharepoint connector in their workspace’s [**Admin connectors settings**](https://chatgpt.com/admin/ca). Once this is enabled, each user can connect their individual account by signing in to SharePoint through an OAuth flow.

[**Learn more about setting up the Sharepoint synced connector for your workspace.**](https://help.openai.com/en/articles/12143177-sharepoint-synced-connectors-setup)

## August 29, 2025

## ChatGPT Team is now ChatGPT Business

We’ve renamed the ChatGPT Team plan to **ChatGPT Business** to better reflect how customers use ChatGPT today. This is a name change only—there are **no changes to your features, pricing, usage limits, or security**.

You may notice updates in the ChatGPT product, invoices, and emails where the new plan name appears. For more details about the name change, see our [ChatGPT Business Rename FAQ](https://help.openai.com/en/articles/12111915).

## August 27, 2025

## Updates to Codex

Starting today, Codex works with you everywhere you build—in your terminal or IDE, on the web, in GitHub, and even from the ChatGPT iOS app. Your ChatGPT account connects it all, so you can work seamlessly between your local environment and Codex’s cloud without losing state.

We’re excited to introduce the latest Codex updates:

*   **IDE Extension:**The new extension brings codex into VS Code, Cursor, and other VS Code forks, so that you can seamlessly preview local changes and edit code

*   **Sign in with ChatGPT:**Available in both the IDE and CLI, eliminating API key setup and providing access directly through your existing ChatGPT plan

*   **Seamless Local ↔ Cloud Handoff:**Developers can pair with Codex locally and then delegate tasks to the cloud to execute asynchronously without losing state

*   **Upgraded Codex CLI:**Refreshed UI, new commands, and bug fixes

*   **Code reviews in GitHub:**Set up Codex to automatically review new PRs in a repo, or mention @codex in PRs to get reviews and suggested fixes

Additionally, all product information and updates for Codex moving forward will be announced on our new site: [developers.openai.com/codex](http://developers.openai.com/codex).

We invite you to explore the site for more details on these new features, as well as guides on how to get started.

To learn more about Codex, visit the new [developers site](http://developers.openai.com/codex) as well as our general help article [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540).

## August 25, 2025

## Gmail, Google Calendar, and Google Contacts Connectors in ChatGPT

Gmail, Google Calendar, and Google Contacts are now available to connect and use in chat. Once you enable them, ChatGPT will automatically reference them when relevant, making it faster and easier to bring information from these tools into your conversations without having to manually select them each time.

If you already have Gmail or Google Calendar enabled for deep research, you can now also use them in chat. To use them in deep research, you will still need to enable each connector separately and select it every time you start a new deep research request.

Learn more about [**connectors**](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## August 22, 2025

## Project-only memory

An improvement to [projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) is now available. When creating a project, users have the option to enable **project-only memory.**

With **project-only memory** enabled, ChatGPT can use other conversations in that project for additional context, and won’t use your [saved memories](https://help.openai.com/en/articles/11146739-how-does-reference-saved-memories-work) from outside the project to shape responses. Additionally, it won’t carry anything from the project into future chats outside of the project.

This creates a focused, self-contained space, which is useful for long-running or sensitive work where you want ChatGPT to stay anchored to that project’s tone, context, and history.

Note:

*   **Personal Memory** must be enabled to utilize this feature.

    *   **Settings**->**Personalization**->**Memory**

*   **Workspace Memory must be enabled to utilize this feature.**

    *   Workspace owners can enable this by **Workspace Settings** ->**Memory**

*   This feature will initially only be available on the ChatGPT website and Windows app. Support for mobile (iOS and Android) and macOS app will follow in the coming weeks.

Learn more about [memory in projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt#h_374a3efb05).

## August 11, 2025

## Additional connectors

**Now connect even more tools in ChatGPT for useful, relevant responses in chat.**

Microsoft Teams, Outlook email and calendar, and Github are now available to search by chat in addition to deep research.

To enable, visit **Settings** → **Connectors**→ **Connect**on the application. Note that connectors are still in beta and defaulted off for Enterprise & Edu plans. Admins can enable them for their workspace in [Settings](https://chatgpt.com/admin/settings).

## August 7, 2025

## GPT-5

GPT-5 is slowly rolling out to all users on ChatGPT Plus, Pro, Team, and Free plans worldwide across web, mobile, and desktop. GPT-5 will be available to ChatGPT Enterprise and Edu plans soon.

GPT-5 in ChatGPT is our next flagship model and the new default for all logged-in users. It simplifies ChatGPT to a single auto-switching system that brings together the best of our previous models into a**smart, fast model.**

GPT-5 is available to all ChatGPT Tiers. Users on Paid tiers - Plus, Pro, and Team - have access to the model picker, which enables you to manually select GPT-5 or GPT-5 Thinking. Pro and Team tier users have access to GPT-5 Thinking Pro, which takes a bit longer to think but delivers the accuracy you need for complex tasks.

[Learn more about GPT-5 in ChatGPT.](https://help.openai.com/en/articles/11909943)

## Legacy models

We will enable Team users to continue to access legacy mode - [learn more](https://legacy%20model%20access%20for%20team,%20enterprise,%20and%20edu%20users/).

If you open a conversation that used one of these models:

*   GPT-4o

*   GPT-4.1

*   GPT-4.5

*   GPT-4.1-mini

*   o4-mini

*   o4-mini-high

*   o3

*   o3-pro

ChatGPT will automatically switch it to the closest GPT-5 equivalent. Chats with 4o, 4.1, 4.5, 4.1-mini, o4-mini, or o4-mini-high will open in GPT-5, chats with o3 will open in GPT-5-Thinking, and chats with o3-Pro will open in GPT-5-Pro (available only on Pro and Team).

Please note that Voice mode is still powered by GPT-4o.

## Personalities

You can now choose from four distinct personalities or use the Default personality in your [Customize ChatGPT settings](https://chatgpt.com/#settings/Personalization). Default is the standard ChatGPT style: clear, neutral, and adaptable. The other personalities each have their own style and tone, described below.

**Cynic** – Sarcastic and dry, delivers blunt help with wit. Often teases, but provides direct, practical answers when it matters.

**Robot** – Precise, efficient, and emotionless, delivering direct answers without extra words.

**Listener** – Warm and laid-back, reflecting your thoughts back with calm clarity and light wit.

**Nerd** – Playful and curious, explaining concepts clearly while celebrating knowledge and discovery.

Please note that these personalities will not apply to Voice mode.

## Accent Colors

You can now set an accent color that applies to elements in ChatGPT, including your conversation bubbles, the Voice button, and highlighted text.

**On web:** Click your profile icon at the bottom left, select **Settings**, go to the **General** tab, and choose an option from the **Accent color** drop-down.

**On mobile (iOS and Android):** Tap your profile icon at the bottom, go to **Personalization**, then select **Color Scheme** to pick your accent color.

## ChatGPT Voice updates

Today we’re rolling out improvements to Voice Mode to make it more accessible and useful for everyone. It also now works with custom GPTs. We’re expanding access with near-unlimited use for Plus users and hours each day for Free users. To simplify the experience, Standard Voice Mode will be retired in 30 days, unifying all users onto our latest voice experience.

For paid users, Voice now adapts to your instructions, adjusting its speaking style (length, speed, tone, and more) to fit the moment.

## July 29, 2025

## Study Mode

Study mode is currently available to users in Free, Plus, Pro, and Teams plans globally and will expand to Edu plans in the coming weeks. Study mode works with any model available in ChatGPT on iOS, Android, web, and desktop.

Study mode is a new learning experience in ChatGPT designed to help you build a deeper understanding of any topic. When you turn it on, ChatGPT will ask interactive questions to understand your goals and skill level, then work with you to reach the answer together.

With Study mode enabled, ChatGPT can:

*   Guide understanding with Socratic-style questions.

*   Break concepts into easy to follow sections starting simple and adding complexity as you progress.

*   Personalize responses based on your past chats if memory is on, using examples and tips tailored to you.

*   Check your understanding with open-ended prompts and feedback.

*   Work with your materials by referencing images or PDFs you upload.

You can enable study mode at any time by selecting **Tools** in the prompt window and choosing **Study and learn** from the drop‑down menu or go to [chatgpt.com/studymode](http://chatgpt.com/studymode).

Study mode is powered by custom system instructions and can have some inconsistent behavior and mistakes across conversations. We plan on training this behavior directly into our main models once we’ve learned what works best through iteration and user feedback.

[Learn more about study mode.](https://help.openai.com/en/articles/11780217)

## July 24, 2025

## Canva and Notion connectors

Team users can now connect to Canva and Notion for both chat search and deep research.

Learn more about [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## Chat search for HubSpot and custom connectors (MCP)

Team users can now utilize chat search with HubSpot and custom connectors (MCP) in addition to deep research.

Learn more about [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt), as well as [how to create a custom connector using MCP](https://platform.openai.com/docs/mcp).

## July 8, 2025

## New flexible pricing for ChatGPT Team plans

Flexible pricing for Team plans introduces credit-based access to advanced ChatGPT models and features. All users retain unlimited access to core ChatGPT models and features.

See [Flexible pricing for the Enterprise and Team plan](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-and-team-plan) for details.

## June 24, 2025

Projects for Team users now support up to 40 uploaded files, increased from the previous limit of 20.

## June 12, 2025

**Adding More Capabilities to Projects**

Starting today, we’re adding several updates to projects in ChatGPT to help you do more focused work. These updates are available for Plus, Pro, and Team users.

*   Deep research and voice mode support

*   Sharing chats from projects

*   Starting a new project directly from a chat

*   Upload files and access model selector on mobile

[Learn more](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt) about projects.

## June 4, 2025

## ChatGPT record mode

Capture meetings, brainstorms, or voice notes.

*   ChatGPT will transcribe, summarize, and turn them into helpful outputs like follow-ups, plans, or even code.

*   Available on the macOS desktop app only

Admins can turn record mode off for your workspace in Admin Settings.

Learn more about [ChatGPT Record](https://help.openai.com/en/articles/11487532).

## Connectors in ChatGPT (Beta)

Customers can now enable connectors to bring internal tools and content into ChatGPT.

*   Supported connectors: Google Drive, SharePoint, Dropbox, and Box

*   Real-time access with in-line citations

*   Admins control connector access in Admin Settings

Learn more about [Connectors in ChatGPT](https://help.openai.com/en/articles/11487775). Available to Team, Enterprise, and Edu customers.

## Connectors in deep research (Beta)

Use connectors in Deep Research to generate long-form, cited responses that include your company’s internal tools.

*   Supported connectors: Google Drive, SharePoint, Dropbox, Box, Outlook, Gmail, Google Calendar, Linear, GitHub, HubSpot, and Teams

*   Combines internal + web sources for synthesis

Learn more about [Connectors in ChatGPT](https://help.openai.com/en/articles/11487775). Available to Team, Enterprise, and Edu customers.

## Google Drive synced connector

The synced connector indexes your organization’s Drive content in advance, enabling fast and high quality contextual responses.

*   Semantic search across Docs, Slides, Sheets, and more in ChatGPT

*   Expanded model support to o3 and o4-mini for ChatGPT Team, in addition to GPT-4o

*   Admin scoping by user

Learn more about the [Google Drive synced connector](https://help.openai.com/en/articles/10847137). Available to Team, Enterprise, and Edu customers.

## Custom connectors via Model Context Protocol (Beta)

Admins can now build and deploy custom connectors to proprietary systems using Model Context Protocol (MCP).

*   Requires a remote MCP server

*   Available only in deep research

*   Admin-published connectors appear in the connector list for all users

Learn more about [building custom connectors with MCP](http://platform.openai.com/docs/mcp). Available to Team, Enterprise, and Edu customers.

## SSO

Team workspace admins can now enable SAML-based Single Sign-On (SSO) for simplified, secure access management.

*   Included for no extra cost in Team plans

*   Admins can enable via Admin Settings

Lean more about [SSO for Team](https://help.openai.com/en/articles/11489188).

## May 15, 2025

## Dropbox connector for deep research for Plus/Pro/Team

ChatGPT deep research with Dropbox is available globally to Team users. It is also gradually rolling out to Plus and Pro users, except for those in the EEA, Switzerland, and the UK. Enterprise user access will be announced at a later date.

See: [Connect apps to ChatGPT deep research](https://help.openai.com/en/articles/11367239-connect-apps-to-chatgpt-deep-research)

## GitHub connector for deep research

The GitHub connector is now available globally to Plus/Pro/Team users, including those in the EEA, Switzerland, and the UK.

## May 14, 2025

## Releasing GPT-4.1 in ChatGPT for all paid users

Since its launch in the API in April, GPT-4.1 has become a favorite among developers—by popular demand, we’re making it available directly in ChatGPT.

GPT-4.1 is a specialized model that excels at coding tasks. Compared to GPT-4o, it's even stronger at precise instruction following and web development tasks, and offers an alternative to OpenAI o3 and OpenAI o4-mini for simpler, everyday coding needs.

Starting today, Plus, Pro, and Team users can access GPT-4.1 via the "more models" dropdown in the model picker. Enterprise and Edu users will get access in the coming weeks. GPT-4.1 has the same rate limits as GPT-4o for paid users.

## May 12, 2025

## Microsoft Sharepoint and OneDrive connector for deep research for Plus/Pro/Team

ChatGPT deep research with Sharepoint and OneDrive is available globally to Team users. It is also gradually rolling out to Plus and Pro users, except for those in the EEA, Switzerland, and the UK. Enterprise user access will be announced at a later date.

See: [Connecting SharePoint and Microsoft OneDrive to ChatGPT deep research](https://help.openai.com/en/articles/11367239-connecting-sharepoint-and-microsoft-onedrive-to-chatgpt-deep-research)

## Export Deep Research as PDF for Plus/Pro/Team

You can now export your deep research reports as well-formatted PDFs—complete with tables, images, linked citations, and sources.

To use, click the share icon and select 'Download as PDF.' It works for both new and past reports.

## May 8, 2025

## GitHub connector for deep research for Plus/Pro/Team

ChatGPT deep research with GitHub is available globally to Team users. It is also gradually rolling out to Plus and Pro users, except for those in the EEA, Switzerland, and the UK. Enterprise user access will be announced at a later date.

See: [Connecting GitHub to ChatGPT deep research](https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt-deep-research).

## January 14, 2025

## Scheduled tasks in ChatGPT

Today we’re rolling out a beta version of tasks—a new way to ask ChatGPT to do things for you at a future time. Whether it's one-time reminders or recurring actions, tell ChatGPT what you need and when, and it will automatically take care of it.

Scheduled tasks is in early beta for Plus, Pro, and Teams. Eventually this will be available to anyone with a ChatGPT account.

For details see Scheduled tasks in ChatGPT.

## **December 13, 2024**

## **Projects in ChatGPT**

ChatGPT Projects are available to all Plus, Team, and Pro users.

Projects provide a new way to group files and chats for personal use, simplifying the management of work that involves multiple chats. You can set custom instructions and upload files in your Projects, and any conversations in your Project share context with your uploaded files and custom instructions. Chats in Projects use GPT-4o and support the following features:

*   Canvas

*   Advanced data analysis

*   DALL•E

*   Search

## Nov 19, 2024

## Advanced Voice for ChatGPT Web

Starting today, we’re beginning to roll out Advanced Voice Mode on web (already available on mobile and desktop apps). You can now start a voice chat on chatgpt.com on your desktop and have real-time, natural conversations with ChatGPT while doing tasks like shopping, planning, writing, and brainstorming.

We’re starting to roll out to all paid (Plus, Team, Enterprise, and Edu) users today, and expect it to take a few days.

## **May 16, 2024**

## **Improvements to data analysis in ChatGPT**

Today, we’re starting to roll out enhancements to data analysis:

*   Upload the latest file versions directly from Google Drive, Microsoft OneDrive Personal, and Microsoft OneDrive including Sharepoint

*   Interact with tables and charts in a new expandable view

*   Customize and download presentation-ready charts and documents

Data analysis improvements are available in our new flagship model, GPT-4o, for ChatGPT Plus, Team, and Enterprise users.

## **May 13, 2024**

## **Introducing GPT-4o**

GPT-4o is our newest flagship model that provides GPT-4-level intelligence that is much faster and improves on its capabilities across text, voice, and vision. Currently, only the new text and image capabilities have been rolled out. You can read more about the announcement here.

Plus users will have a message limit that is up to 5x greater than free users, and Team and Enterprise users will have even higher limits.

## **Apr 29, 2024**

## **Memory is now available to Plus users**

Memory is now available to all ChatGPT Plus users, except in Europe Korea where we will be rolling it out soon. Using Memory is easy: just start a new chat and tell ChatGPT anything you’d like it to remember.

Memory can be turned on or off in settings. Team, Enterprise, and GPTs to come.

## **Jan 10, 2024**

## **Introducing the GPT Store and ChatGPT Team plan**

## Discover what’s trending in the GPT Store

The store features a diverse range of GPTs developed by our partners and the community. Browse popular and trending GPTs on the community leaderboard, with categories like DALL·E, writing, research, programming, education, and lifestyle.

Explore GPTs at chatgpt.com/gpts.

## Use ChatGPT alongside your team

We’re launching a new ChatGPT plan for teams of all sizes, which provides a secure, collaborative workspace to get the most out of ChatGPT at work.

ChatGPT Team offers access to our advanced models like GPT-4 and DALL·E 3, and tools like Advanced Data Analysis. It additionally includes a dedicated collaborative workspace for your team and admin tools for team management. As with ChatGPT Enterprise, you own and control your business data — we do not train on your business data or conversations, and our models don’t learn from your usage. More details on our data privacy practices can be found on our privacy page and Trust Portal.

You can learn more about the ChatGPT Team plan here.
