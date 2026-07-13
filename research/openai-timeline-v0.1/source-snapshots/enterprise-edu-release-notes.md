Title: ChatGPT Enterprise & Edu - Release Notes | OpenAI Help Center

URL Source: https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes

Markdown Content:
## July 6, 2026 ChatGPT for PowerPoint is now generally available

ChatGPT for PowerPoint is now generally available for Enterprise and Edu workspaces. Users can create and revise editable presentations directly in Microsoft PowerPoint, analyze a deck’s narrative and structure, and use approved Skills and apps to work from authorized sources. Advanced edits and template matching may still require review.

Admins can enable the add-in through workspace settings or deploy it through Microsoft 365, including RBAC-based access where applicable. For eligible workspaces, ChatGPT for PowerPoint supports workspace policy enforcement, scoped source access, Compliance API coverage for prompts and responses, EU Inference Residency, and Enterprise Key Management. [Learn more about ChatGPT for PowerPoint](https://help.openai.com/articles/20001242).

## Excel/Sheets and Workspace Agent pricing

ChatGPT for Excel/Sheets tasks now use token-based credit pricing for Enterprise and Edu workspaces. Workspace Agent runs also use token-based credit pricing for Enterprise workspaces. Credit use is based on input tokens, cached input tokens, and output tokens rather than a fixed credit cost.

ChatGPT for PowerPoint remains free for Enterprise customers through August 6, 2026. Charging starts after that date under the same token-based pricing model as ChatGPT for Excel/Sheets. [Learn more in the ChatGPT rate card](https://help.openai.com/articles/11481834).

## **June 26, 2026**

## **Simplified controls in the model picker**

We’re rolling out an updated model picker for ChatGPT Enterprise and Edu on web, iOS, and Android. It makes it easier to choose the balance of speed and reasoning effort that works best for a task without changing the underlying models available to a workspace.

The picker now includes:

*   **Instant**

*   **Medium**

*   **High**

*   **Extra High**

*   **Pro Standard**

*   **Pro Extended**

Medium replaces Thinking Standard, High replaces Thinking Extended, and Extra High replaces Thinking Heavy. Pro Standard and Pro Extended continue to use GPT-5.5 Pro. Thinking Light is no longer available.

All six options are available to Enterprise and Edu workspaces, subject to workspace access settings. **Reasoning Model Access** controls Medium, High, and Extra High. **Pro Model Access** controls Pro Standard and Pro Extended. Options that a member cannot access are hidden from the picker.

The **Redirect Auto Router to Thinking mini** setting is unchanged and continues to apply only to automatic reasoning. On iOS and Android, the picker appears at the top of the conversation. On web, it appears in the message composer.

## **Admin controls for plugins for ChatGPT Enterprise and Edu**

Workspace admins and owners can now manage plugins from **Workspace settings > Plugins**. This page brings plugin discovery and governance into one surface, including search and filters for status, installation policy, roles, category, and catalog. Additionally, workspace owners can enable or disable plugins for their workspace or for select roles from **Workspace settings > Permissions & Roles**.

Admins and owners can set whether plugins are available for members to install or installed by default - for the workspace, or for specific roles. Admins can also view the apps the plugin uses, and manage the plugin from this view. Learn more: [Plugins in Codex](https://help.openai.com/en/articles/20001256-plugins-in-codex)

## **June 25, 2026**

## **Memory improvements for ChatGPT Enterprise and Edu**

We’re rolling out improved memory for ChatGPT Enterprise and Edu. When memory is enabled, ChatGPT can use relevant context from past chats to keep memory current and make responses more relevant as work changes, rather than relying only on details saved manually.

Users can now:

*   Review a memory summary showing information ChatGPT may use to personalize responses.

*   View Sources below personalized responses to see relevant context from memories, past chats, and custom instructions.

*   Correct memory, delete a referenced chat, mark a source as not relevant, turn memory off, or return to legacy Saved memories.

The memory summary is a high-level view of relevant context and may not include everything ChatGPT can remember or reference.

For ChatGPT Enterprise, the improved experience will begin with an early access period of approximately two weeks. During early access, admins can turn on Use improved memory in Workspace settings. After early access, it will turn on by default for eligible workspaces unless an admin opts out. Admins and users can switch back to legacy Saved memories.

This update does not affect Codex memory. Project-only memory remains contained within each project and does not use memories or conversations from outside that project. These improvements are available at no additional cost.

Learn more about the

[research](https://openai.com/index/chatgpt-memory-dreaming/)
behind these memory improvements in ChatGPT.

## **Codex Remote GA and DigitalOcean workspaces**

Codex Remote is now generally available to users in ChatGPT Enterprise and Edu workspaces. From the ChatGPT mobile app, users can start or continue work on a connected Mac or Windows host, review progress, and approve actions from their phone. Remote Control now uses authenticated one-to-one QR pairing between each supported mobile device and each host. Connections used since June 8 remain paired; older inactive connections need to pair again. Signing out turns off Remote Control without removing existing pairings.

The new

[DigitalOcean Droplet Workspace plugin](https://chatgpt.com/plugins/share/5dc672c7116c44ff92595d48e72df522)
is also available to ChatGPT Enterprise and Edu users. It lets Codex provision a DigitalOcean Droplet, configure SSH access, and connect it to the Codex app as a remote workspace. Users should update the ChatGPT mobile app and Codex app to the latest versions before connecting.

[Learn more about using Codex with a ChatGPT plan](https://help.openai.com/articles/11369540)
.

## June 19, 2026

## Slack connector actions and OAuth scope approvals

Enterprise and Edu workspaces can now enable Slack connector actions in ChatGPT. In addition to searching Slack, ChatGPT can take supported actions such as joining a channel, creating a reminder, uploading a file, or updating a user's Slack profile when the connector and relevant actions are enabled.

Admins can review Slack under Apps in ChatGPT and use Action control to manage which actions are available. Some actions may require additional Slack OAuth scopes or approval from a Slack workspace or Enterprise Grid admin. Existing Slack capabilities that do not require the new scopes continue to work if additional scopes are not approved. Learn more in the

[ChatGPT Slack app article](https://help.openai.com/articles/12525822)
.

## June 18, 2026

## Usage limits, Global Admin Console billing and analytics

Enterprise and Edu admins now have new tools for managing credit usage and reviewing billing-related activity. Usage limits in Workspace settings let admins and owners set monthly credit limits by workspace, group, and user, review increase requests, and migrate from existing weekly limits in Permissions & roles.

The Global Admin Console now also includes updated Analytics and Billing areas for eligible workspaces, including credit analytics, Codex and ChatGPT usage views, plan details, credit balances, grant activity, invoices, usage alerts, and overage limit settings. Admins, owners and analytics viewers can view usage data, and export data across different features and dimensions, such as credits used by Codex and ChatGPT, leaderboards for users and agents, and Codex and ChatGPT usage broken down by feature.

Learn more:

[Setting usage limits in ChatGPT Enterprise and Edu](https://help.openai.com/en/articles/20001001-setting-usage-limits-in-chatgpt-enterprise-and-edu)
,

[Global Admin Console](https://help.openai.com/en/articles/12289294-global-admin-console)
.

## Record & Replay in Codex

Record & Replay is a new Codex app feature for macOS that lets eligible Enterprise and Edu users demonstrate a workflow once and turn it into a reusable skill. It is designed for stable, repeatable workflows that are easier to show than describe, and the generated skill can later guide Codex through similar tasks with available tools such as Computer Use, browser actions, and installed plugins.

Record & Replay requires Computer Use to be available and enabled, and initial availability excludes the European Union, UK and Switzerland. For managed Codex deployments, disabling Computer Use also disables Record & Replay and related enablement flows. Learn more in the

[Record & Replay guide](https://developers.openai.com/codex/record-and-replay)
.

## June 17, 2026

## Data export for ChatGPT Edu workspaces

Members of ChatGPT Edu workspaces without a data residency configuration can now export their workspace data when a workspace admin enables **Data export**. Members can request an export from **Settings > Data controls**, download the export from the email they receive, and upload the included conversation JSON to a new conversation in a personal ChatGPT account for reference.

Data export is off by default, and the setting applies to all workspace members.

[Learn more](https://help.openai.com/articles/20001279)
.

## **June 11, 2026**

## **Library for Enterprise, Edu, and Healthcare workspaces**

Library is rolling out to Enterprise, Edu, and Healthcare workspaces, giving members a dedicated place to find and reuse files they upload to or create in ChatGPT. Files saved to Library follow workspace retention policies.

Workspace owners can control whether ChatGPT automatically references Library files when responding. Turning off automatic referencing does not remove Library or prevent members from browsing, searching, opening, or attaching files themselves. For Healthcare workspaces, automatic referencing is off by default.

Library-specific Compliance API endpoints are also available for exporting and deleting Library files. Library does not introduce new external sharing or multiplayer collaboration.

[Learn more about File storage and Library in ChatGPT](https://help.openai.com/en/articles/20001052-library-for-chatgpt)
.

## **Global admin console updates**

Cloud Console now includes [external app access](https://help.openai.com/en/articles/12289294-global-admin-console#external-access) controls for Sign in with ChatGPT. Admins can turn external application access on or off for the organization, require applications to be approved before members can use them, and approve or disable individual applications.

## **Codex updates**

We’ve shipped a few Codex updates, including:

*   Computer Use for Windows for Enterprise plans. See [Computer Use](https://developers.openai.com/codex/app/computer-use), [Managed configuration](https://developers.openai.com/codex/enterprise/managed-configuration), and the [configuration reference](https://developers.openai.com/codex/config-reference).

*   [Developer mode](https://developers.openai.com/codex/app/browser#developer-mode) for Browser use in Chrome and the Codex in-app browser, where available. Developer mode lets Codex use controlled Chrome DevTools Protocol (CDP) access for performance profiling and deeper debugging of network traffic, console output, runtime errors, DOM state, and applied styles. The feature is turned off by default at the user level, and can be enabled from Codex app settings. Admins and owners can turn off the feature for their workspace from [Codex cloud settings](https://chatgpt.com/codex/cloud/settings/) by accessing the **Policies & Configurations**pane. [Learn more](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan#in-app-browser-developer-mode).

The release also adds /init in the app composer for generating an AGENTS.md scaffold, support for configuring per-app access controls for Computer Use on Windows, clearer usage-limit errors with workspace guidance and reset timing when available, and a new **Unread chats** section in the command menu. [Learn more](https://developers.openai.com/codex/changelog).

## June 8, 2026

## App permissions for connected apps

Workspace admins can now use App permissions, where available, to choose when ChatGPT asks members before using connected apps. Admins can set a workspace-wide default and choose a different permission for individual apps, with options such as **Always ask**, **Any changes**, and **Important actions**.

Important actions is the default and allows ChatGPT to read from apps automatically while asking before actions that may have a meaningful effect outside ChatGPT, expose sensitive information, or be difficult to undo. App permissions replace the previous Action consent setting where available, while app access, RBAC, and Action control remain separate admin controls.

Learn more: [Apps in ChatGPT](https://help.openai.com/en/articles/11487775); [Admin Controls, Security, and Compliance in apps](https://help.openai.com/en/articles/11509118).

## June 5, 2026

## Plugin sharing for Enterprise workspaces

Plugin sharing is now available by default for eligible ChatGPT Enterprise workspaces in Codex. Users can share local plugins with their workspace so teammates can install and use shared plugins from the Codex plugin directory.

Workspace admins can disable plugin sharing in `requirements.toml` using MDM or cloud-managed configuration. Learn more:

[Share a local plugin with your workspace](https://developers.openai.com/codex/plugins/build#share-a-local-plugin-with-your-workspace)
.

## June 2, 2026

## Build and deploy internal workspace apps with Sites

ChatGPT Sites is now available in preview for eligible ChatGPT Enterprise and Edu workspaces. Available as a plugin, users can ask Codex to create, iterate on, and deploy lightweight full-stack JavaScript/TypeScript web apps with hosted site URLs, Sign in with ChatGPT access, and data/file storage, while keeping access workspace-internal.

ChatGPT Sites is default off for Enterprise/Edu workspaces - admins and owners can manage enablement and access through workspace settings and RBAC. ChatGPT Sites can be enabled from **Workspace settings > Permissions & Roles.**Admins and owners can disable published sites from **Workspace settings > Sites.**

For build, deployment, storage, access, and limitation details, see the

[Codex Sites developer guide](https://developers.openai.com/codex/sites)
.

## Role-specific plugins in Codex

Role-specific plugins are rolling out in Codex for supported ChatGPT Enterprise workspaces. This first set includes Sales, Data Analytics, Product Design, Creative Production, Investment Banking, and Public Equity Investing. These plugins package role-specific skills, app integrations, starter prompts, and workflow guidance so teams can use Codex for sales prep, analytics and dashboards, prototypes, creative assets, and financial research.

This launch also adds 66 single-app plugins that expand the integrations available in Codex, including tools such as Databricks, Salesforce, Hex, and Clay. Users can add available plugins from the Codex plugin directory, and Codex can help them complete setup. Workspace admins control the underlying app permissions in workspace settings. For some workflows, such as using Databricks or Snowflake in Data Analytics, admins may need to complete connector setup before users can use the plugin.

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

## Codex updates: Computer use and remote control for Windows, GitHub Enterprise app template support

Codex now supports Computer Use on Windows in the Codex app. Users with Codex access can use Computer Use to let Codex see, click, and type in Windows applications. With remote control, users can also continue Windows workflows from ChatGPT on iOS or Android, or from Codex on Mac, to check progress, respond to prompts, and steer while away from the desk while the Windows machine remains the host for project files, shell, app server, and local context.

Windows Computer Use and remote control are disabled for Enterprise users by default. To enable, contact your OpenAI account representative to be enrolled into early access.

For customer-hosted GitHub Enterprise Server repositories, workspace admins can set up and publish a GitHub Enterprise app from the ChatGPT app template so Codex can use the workspace-specific connector for Codex Web, Code Review, and Security Review.

Learn more: [Computer Use](https://developers.openai.com/codex/app/computer-use), [Remote control](https://developers.openai.com/codex/remote-connections), [Set up the GitHub Enterprise app template in ChatGPT](https://help.openai.com/articles/20001248).

## May 28, 2026

## **New controls and capabilities for ChatGPT workspace agents**

We’re rolling out new model, admin, app access, and response capabilities for ChatGPT workspace agents in Enterprise and Edu.

Workspace agents now support:

*   **GPT-5.5 and reasoning effort controls:** When building an agent, creators can choose GPT-5.5 and set the reasoning effort the agent uses. We’ve also improved response speed across agents.

*   **Role-based publishing permissions:** Workspace admins can control which roles can publish agents to the shared workspace directory.

*   **Guided agent setup:** ChatGPT now asks setup questions to help users create useful agents more quickly.

*   **Speech output:** Agents can now create audio files as part of their responses.

*   **Smarter Slack thread replies:**Agents used in Slack can respond to relevant follow-up messages in a thread after the initial mention. Creators can choose whether an agent responds to relevant thread messages or only when it is mentioned.

## App templates for GitHub Enterprise, Snowflake, and Databricks

Workspace admins and owners on Enterprise and Edu plans can now use ChatGPT app templates to create workspace-specific apps for GitHub Enterprise, Snowflake, and Databricks. App templates provide a guided setup flow for provider-specific configuration such as OAuth credentials, callback URLs, webhook details, managed MCP server URLs, and workspace access controls before admins publish the app to members.

Use the new setup guides to understand the general app-template flow and the provider-specific steps for each template: [ChatGPT app templates](https://help.openai.com/articles/20001247), [GitHub Enterprise app template](https://help.openai.com/articles/20001248), [Snowflake app template](https://help.openai.com/articles/20001249), and [Databricks app template](https://help.openai.com/articles/20001250).

After publishing, admins can manage the resulting app from Workspace settings > Apps > Enabled, including role access, action controls, and action confirmation.

## **May 22, 2026**

## **Workspace agents are now generally available in ChatGPT Business, Enterprise, and Edu.**

Workspace agents help teams get more done together across tools. They can own entire workflows on their own, follow team processes, and be shared across your team so people can build once and use together.

We’ve also added new admin controls and visibility:

*   Agent builders can set safeguards on which actions agents can take for each app enabled in their workspace.

*   Business, Enterprise, and Edu admins can view workspace agent activity and usage in the

[admin console](https://admin.openai.com/)

.

We’ve extended the free period for workspace agents until July 6, 2026. Credit-based pricing will begin on that date. (edited)

## May 21, 2026

## Codex updates: goal mode, browser improvements, remote locked use, admin analytics, and plugin sharing status

Codex now gives Enterprise and Edu users more ways to work toward longer-running goals and iterate in the browser, while eligible admins get updated usage analytics:

*   [Appshots](https://developers.openai.com/codex/appshots) in the macOS app let users attach an app window to a Codex thread with a hotkey, including a screenshot and available text. Appshots are available for ChatGPT Edu accounts today, support for ChatGPT Enterprise accounts coming soon.

*   [Goal mode](https://developers.openai.com/codex/prompting#goal-mode) is generally available across the Codex app, IDE extension, and CLI, so users can define an outcome and success criteria and let Codex keep working toward it.

*   [In-app browser annotations](https://developers.openai.com/codex/app/browser#styling-feedback) support more precise styling feedback for browser-based and frontend work.

*   [Locked computer use](https://developers.openai.com/codex/app/computer-use#locked-use) lets users keep Codex working remotely and securely after the Mac locks, subject to existing regional constraints. Admins and owners can turn this feature off by setting `remote_computer_use = false` in the [Policies & Configurations](https://chatgpt.com/codex/cloud/settings/policies) setting in Codex cloud. Review [configuration reference](https://developers.openai.com/codex/config-reference#requirementstoml) for more details.

*   [Browser-use improvements](https://developers.openai.com/codex/app/browser) add advanced annotation mode, faster asset extraction, read-only JavaScript context, tab grouping usability, less Chrome extension tab clutter, and reliability improvements.

*   The [global admin console](https://help.openai.com/en/articles/12289294-global-admin-console) now includes Codex analytics for Enterprise admins, with active users, credits and tokens, threads and turns, user leaderboards, plugin usage, accepted lines of code, model usage, and a console-aligned UI.

*   [Plugin sharing](https://developers.openai.com/codex/plugins/build#share-a-local-plugin-with-your-workspace) lets teams share locally built plugins with workspace members from the Codex app. Plugin sharing is **disabled by default for ChatGPT Enterprise**- reach out to your OpenAI account contact for details on how to enable the feature. For ChatGPT Edu accounts, plugin sharing is enabled by default.

Learn more: [Goal mode](https://developers.openai.com/codex/prompting#goal-mode), [locked computer use](https://developers.openai.com/codex/app/computer-use#locked-use), [in-app browser annotations](https://developers.openai.com/codex/app/browser#styling-feedback), and [plugin sharing](https://developers.openai.com/codex/plugins/build#share-a-local-plugin-with-your-workspace).

## **Workspace agents are now generally available in ChatGPT Business, Enterprise, and Edu.**

Workspace agents help teams get more done together across tools. They can own entire workflows on their own, follow team processes, and be shared across your team so people can build once and use together.

We’ve also added new admin controls and visibility:

*   Agent builders can set safeguards on which actions agents can take for each app enabled in their workspace.

*   Business, Enterprise, and Edu admins can view workspace agent activity and usage in the

[admin console](https://admin.openai.com/).

We’ve extended the free period for workspace agents until July 6, 2026. Credit-based pricing will begin on that date.

## May 18, 2026

## Beta label removed from the Apps Directory and app creation flow

We removed the Beta label from the Apps Directory in ChatGPT on web and desktop, and from the new app creation flow.

This is a labeling update only. It does not change the Apps Directory experience, app creation workflows, dev mode capabilities, or the existing elevated-risk guidance for dev mode.

## May 15, 2026

## Microsoft Teams app with admin-managed sync in ChatGPT

The [Microsoft Teams app with admin-managed sync](https://help.openai.com/en/articles/20001234) is now available for eligible ChatGPT Enterprise and Edu workspaces. Owners and admins can connect Microsoft Teams once for the workspace so ChatGPT can reference supported Teams messages and conversation metadata that members already have permission to access.

Owners and admins can enable sync from Workspace settings → Apps, choose which Teams content to include with the scope picker and an optional Microsoft Purview sensitivity label filter, then deploy it through Deploy to your team. The synced experience is read only, may take time to fully populate after setup, and remains separate from the regular self-service Microsoft Teams app.

## May 14, 2026

## Codex remote access and access tokens for automation

Codex now supports remote access from the ChatGPT mobile app, letting users stay connected to longer-running work, answer questions, redirect execution, approve actions, review outputs, and switch between connected hosts while Codex continues operating in the underlying Mac host or connected remote environment. The mobile experience surfaces live state from that environment, including project context, approvals, screenshots, terminal output, diffs, and test results. Enterprise workspaces can also use Codex access tokens for trusted, non-interactive local workflows that need ChatGPT workspace identity and enterprise controls without a browser sign-in.

To try it, update both the ChatGPT mobile app and the Codex app on macOS. Mobile setup can require workspace-enabled Remote Control access and may involve SSO, multi-factor authentication, or passkey steps.

Additionally, access tokens are available for ChatGPT Enterprise workspaces, with admins able to manage workspace-level availability, members using permitted roles to create their own tokens, and governance surfaces reflecting access token activity where available.

## May 7, 2026

## ChatGPT Workspace Agents now support Enterprise workspaces with EKM

ChatGPT workspace agents are now available to eligible ChatGPT Enterprise workspaces with Enterprise Key Management (EKM).

Workspace agents let organizations build and use agents for repeatable tasks and business workflows across connected apps, including ChatGPT and Slack. Agents can be created from templates or from scratch, previewed before publishing, shared within a workspace, and run on a schedule.

Eligible EKM workspaces can now create and use workspace agents, connect supported tools and apps, add skills, files, and custom MCP servers, schedule recurring runs, use agents in connected Slack channels, and view version history and analytics.

Workspace agents remain off by default. Admins can enable agent building, publishing, and Slack usage for eligible workspaces through admin controls.

## May 6, 2026

## ChatGPT for Intune for iOS and iPadOS

We’ve added ChatGPT for Intune to the Apple app store. ChatGPT for Intune is a separate iOS app for ChatGPT Enterprise organizations that manage mobile access management through Microsoft Intune and Microsoft Entra. The app lets IT teams apply Microsoft app protection policies and Conditional Access policies to the ChatGPT mobile experience on iOS and iPadOS.

ChatGPT for Intune is available for Enterprise accounts only and requires organizational onboarding with OpenAI before use. Enterprise owners and admins should reach out to their OpenAI account director to start onboarding, then configure the required Microsoft Entra and Intune settings before rollout.

Once onboarded, users can download the app from the Apple App Store and sign in with enterprise Microsoft authentication. Learn more in [Setting up ChatGPT for Intune](https://help.openai.com/en/articles/20001232-setting-up-chatgpt-for-intune).

## **Easier model selection in ChatGPT**

We’re making it easier to choose the right model before you send a message. Model selection now appears in the composer, so you can find and switch models from the same place where you write your prompt.

We’re also moving thinking effort controls into the model picker. When you choose a Thinking or Pro model, you can select the level of thinking effort directly from the model picker.

## Analytics and Agents in the global admin console

The global admin console now includes new Analytics and Agents areas. Analytics gives admins a consolidated view of adoption and usage, with trend views for active users and message activity plus drilldowns for GPTs, projects, skills, users, tool interactions, connector interactions, and workspace health.

Agents gives admins a consolidated view of workspace agents across the organization. Admins can open an agent to review details such as Agent ID, recent activity, connected apps, memory files, schedules, and agent analytics such as unique users and runs over time, or move into Builder to edit it. Workspace Owners can access these views from the global admin console. [Learn more](https://help.openai.com/en/articles/12289294-global-admin-console).

## May 5, 2026

## ChatGPT for Excel and Google Sheets

ChatGPT for Excel and Google Sheets is now available globally for Enterprise, Edu, and K-12 workspaces, bringing a spreadsheet-native ChatGPT sidebar to Excel and Google Sheets for building, updating, explaining, and reviewing multi-tab spreadsheets. It supports Skills and apps where available so spreadsheet work can be grounded in approved files, systems, and data sources.

Enterprise, Edu, and K-12 customers have a free preview through June 2, 2026; after that, usage follows credits and usage terms. The experience supports workspace controls including RBAC, data and inference residency where available, Enterprise Key Management, and Compliance API coverage. Admins can enable ChatGPT for Excel and Sheets from workspace settings. [Learn more](https://help.openai.com/articles/20001063).

## **April 30, 2026**

## **Updates to admin-managed SharePoint sync**

We are migrating the ChatGPT SharePoint app [scope requests](https://help.openai.com/articles/12143177-sharepoint-app-in-chatgpt?#permission-requested-scope) from **delegated scopes to** Microsoft**application scopes,**for the admin-managed "**Deploy to your team**" sync option. The migration helps ChatGPT sync selected SharePoint content and evaluate SharePoint permissions, including legacy SharePoint site group membership, without depending only on the files visible to the admin who completed setup. Additionally, admins and owners can configure **Microsoft Purview sensitivity**labels from app settings.

These new scopes will need to be approved by a Microsoft Entra admin for the new feature set to be active. Admins and owners can conveniently re-authenticate the SharePoint app by navigating to **Workspace Settings > Apps,**and locating the prompt "Reconnect SharePoint for better syncing" at the top of the view, or by searching for the SharePoint app and clicking the 'Re-auth required' button to obtain the new feature set. This prevents the need to disconnect and reconnect, which will cause re-syncing of the index.

Learn more about the [SharePoint app in ChatGPT](https://help.openai.com/en/articles/12143177-sharepoint-app-in-chatgpt), and review the [FAQ](https://help.openai.com/en/articles/12143177-sharepoint-app-in-chatgpt#faq-admin-managed-app-with-sync) for the admin-managed sync option for more information.

## April 22, 2026

## **ChatGPT Workspace Agents for Enterprise and Business**

ChatGPT workspace agents are rolling out gradually over the next few weeks to ChatGPT Business and Enterprise workspaces.

Workspace Agents let organizations build and use agents for repeatable tasks and automate business workflows leveraging all your connected apps & can run in ChatGPT and/or Slack. Workspace agents can be created, previewed before publishing, shared within a workspace, and run on a schedule.

Eligible workspaces can now:

*   Create agents from templates or build from scratch.

*   Connect agents to tools and apps such as Google Drive, Google Calendar, Slack, and SharePoint.

*   Add skills, files, and custom MCP servers.

*   Share agents privately, by link, or in the workspace directory.

*   Schedule recurring runs in ChatGPT.

*   Use agents in connected Slack channels.

*   View version history and analytics for agents.

Workspace admins can also manage access to agent building, publishing, and Slack usage through admin controls. ChatGPT workspace agents are off by default at launch, and admins can enable them for eligible workspaces.

**Note:** ChatGPT workspace agents are not available for ChatGPT Enterprise workspaces with EKM at launch.

## Data Residency for apps with sync in Japan

All apps with sync now support in-region data residency in Japan for ChatGPT Enterprise/Edu workspaces. Previously, in Japan, data residency for apps with sync was limited to Google Drive and GitHub. This launch extends Japan data residency support to all sync connectors. Learn more about [data residency](https://help.openai.com/en/articles/9903489-data-residency-and-inference-residency-for-chatgpt).

## **April 9, 2026**

## **GPT-5.3 Instant mini in ChatGPT**

Today, we’re releasing**GPT-5.3 Instant Mini**in ChatGPT. It replaces GPT-5 Instant Mini as the fallback model users reach after hitting their rate limits for GPT-5.3 Instant. Because it serves as a fallback, it won’t appear in the model picker.

Compared with GPT-5 Instant Mini, GPT-5.3 Instant Mini feels more natural in conversation, with stronger writing and contextual awareness throughout chats. It outperforms GPT-5 Instant Mini across a range of use cases.

## **Control SCIM group discoverability in sharing flows**

Workspace owners can now control whether SCIM-managed groups are discoverable in sharing flows like projects and GPTs. A new setting **Discoverable by workspace users** is available under **Identity & provisioning > Directory Sync (SCIM)** and is enabled by default to preserve existing behavior.

When this setting is **disabled**:

*   SCIM-managed groups will **no longer appear**in sharing flows.

*   If a project or GPT is already shared with one or more SCIM-managed groups, those groups will be removed from the sharing list the next time the project or GPT is updated.

This setting can help reduce accidental oversharing and ensures group-based sharing remains aligned with centrally managed access policies.

For more information, see: [SCIM Integration FAQ](https://help.openai.com/articles/10011769).

## April 8, 2026

## Outlook shared mailbox and shared calendar actions

The Outlook Email and Calendar apps for ChatGPT now support more delegated Outlook workflows for teams. With the right Microsoft permissions, users can ask ChatGPT to list and read shared mailbox messages, browse shared mailbox folders, mark shared mail read or unread, move shared messages, and send plain-text email from or on behalf of a shared mailbox. ChatGPT can also create, update, respond to, cancel, delete, and attach small files to events on shared Outlook calendars.

Workspace owners and admins should review Microsoft Entra permissions, [RBAC](https://help.openai.com/en/articles/11750701-rbac) access, and the Outlook app's action controls before enabling newly added actions. Users who previously connected Outlook may need to reconnect after the workspace enables the new actions; Microsoft Entra approval may also be required. [Learn more](https://help.openai.com/en/articles/12512241).

## April 2, 2026

## New Codex seats in ChatGPT Enterprise

We're introducing a new seat type for ChatGPT Enterprise: a

[Codex seat](https://help.openai.com/en/articles/8265053-what-is-chatgpt-enterprise#overview)
based on

[flexible pricing](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans)
. Codex seats provide access to Codex only - they do not include ChatGPT workspace access, and have no fixed cost per user per month. Using Codex requires

[workspace credits](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans#how-do-credits-work-in-chatgpt-plans)
, while standard ChatGPT seats continue to include ChatGPT and Codex with baseline access and optional flexible pricing for usage beyond included

[rate limits](https://developers.openai.com/codex/pricing#frequently-asked-questions)
.

Read more about the Codex seat and seat-type behavior

[here](https://help.openai.com/en/articles/8265053-what-is-chatgpt-enterprise#overview)
. For member management, SCIM provisioning, and how to change a member's seat type, see

[Managing members, seat types, roles and access in ChatGPT Enterprise](https://help.openai.com/en/articles/8266401-managing-members-seat-types-roles-and-access-in-chatgpt-enterprise#change-member-seat-types)
.

We've also updated the

[Codex Rate Card](https://help.openai.com/en/articles/20001106-codex-rate-card)
. New ChatGPT Enterprise workspaces use

[token-based rates](https://help.openai.com/en/articles/20001106-codex-rate-card#codex-rate-card-token-based-pricing)
, while existing Enterprise and new/existing

[ChatGPT Edu](https://help.openai.com/en/articles/9377311)
,

[ChatGPT for Teachers](https://help.openai.com/en/articles/12844995)
, and

[ChatGPT for Healthcare](https://help.openai.com/en/articles/20001046)
workspaces continue on the

[legacy message-based rates](https://help.openai.com/en/articles/20001106-codex-rate-card#legacy-rate-card)
until migration. If you have questions about the new rates or migration timing, contact your OpenAI representative.

## March 27, 2026

## Updated Box, Notion, Linear, and Dropbox apps

We're rolling out updated [Box](https://help.openai.com/en/articles/12368225-box-app-with-sync), [Notion](https://help.openai.com/en/articles/12532955-notion-app-with-sync), [Linear](https://help.openai.com/en/articles/12526595-linear-app-with-sync), and [Dropbox](https://help.openai.com/en/articles/12364275-dropbox-app-with-sync) apps in ChatGPT Enterprise and Edu. These updates add new app actions, including new write capabilities where supported, and bring the latest app experience into ChatGPT.

The new apps are disabled by default, and workspace admins/owners can review the app as well as the app's actions in **Workspace settings > Apps**to enable those aligned to their workspace needs. New actions (such as write actions) may involve updated scopes - admins/owners should check the [Box](https://help.openai.com/en/articles/12368225-box-app-with-sync), [Notion](https://help.openai.com/en/articles/12532955-notion-app-with-sync), [Linear](https://help.openai.com/en/articles/12526595-linear-app-with-sync), and [Dropbox](https://help.openai.com/en/articles/12364275-dropbox-app-with-sync) app pages for details, and authorize any scopes required. New users may not be able to connect these apps until the scope authorizations are met, or actions are enabled/disabled in alignment with authorized scopes.

Members who previously connected these apps may need to reconnect the app after admin review to start using the updated experience.

## Add sources to your projects from anywhere

Projects now make it easier to build a living knowledge base by adding sources from apps, conversations, and quick text inputs. You can paste a link to a Slack channel or a Google Drive file or folder to add it directly as a project source, save useful ChatGPT responses into your project so strong outputs become reusable knowledge, and paste notes, briefs, or reference material directly into a project.

In Enterprise and Edu workspaces, app access follows workspace controls. Admins and owners can manage app availability in Workspace settings > Apps, and can use [RBAC](https://help.openai.com/en/articles/11750701-rbac) to assign app access to specific roles. Learn more about [projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt).

## **March 26, 2026**

## **Plugins in Codex**

Codex now includes a curated plugins directory that lets users discover, install, and use packaged workflows built from apps and skills directly in Codex. Plugins are installable bundles for reusable Codex workflows, making it easier to share the same setup across projects or teams. Plugins can package skills, optional app integrations, and MCP server configurations in a single place. [Learn more.](https://developers.openai.com/codex/plugins)

Plugin access follows workspace app controls. Enterprise and Edu admins can manage enabled apps in Workspace settings → Apps, and can use [RBAC](https://help.openai.com/en/articles/11750701-rbac) to assign app access to specific roles.

## **March 25, 2026**

## **Google Drive connector unification**

Google’s file connectors in ChatGPT are now unified under Google Drive, providing a single app experience for interacting with your Google Docs, Sheets and Slides on Google Drive.

The new Google Drive actions are off by default for Enterprise/Edu workspaces. Admins/owners can review and manage actions from **Workspace settings > Apps.**Locate the Google Drive entry and click **Manage actions.**

Existing users of Google Drive, Docs, Sheets and Slides apps are unaffected - previously connected apps continue to work. After the new actions are enabled by admins/owners, existing users may reconnect the Google Drive app to start using the new actions within ChatGPT. New users can connect only to the Google Drive app to use Docs, Sheets and Slides actions, without needing to connect the separate apps.

Google Workspace admins may need to re-authorize Google scopes corresponding to app actions - otherwise, users may hit connection errors when trying to connect. [Read more.](https://help.openai.com/en/articles/10408842-google-app-for-chatgpt-data-controls-faq)

## March 20, 2026

## **Impact survey updates in workspace analytics**

### ChatGPT Edu

Impact surveys are now available for ChatGPT Edu in addition to Enterprise, with an Edu-specific question set.

### Export

Impact survey results can now be exported.

### Admin-created surveys

Workspace owners can now launch an **Admin-created**survey from the **Impact**tab. These surveys let workspace owners trigger an impact survey for their workspace on demand, unlike the regularly scheduled OpenAI-created surveys.

Note that custom question and answer sets are not supported at this time.

### Survey start date change

## March 19, 2026

## Legacy deep research mode deprecation notice

The legacy deep research mode will be removed on Thursday, March 26, 2026. This change only affects the legacy mode; the current deep research experience will remain unchanged.

Historical conversations and results will remain accessible.

To learn more about deep research, see: [Deep research in ChatGPT](https://help.openai.com/articles/10500283).

## **March 18, 2026**

## **GPT-5.4 mini in ChatGPT**

We’re rolling out GPT-5.4 mini in ChatGPT. GPT-5.4 mini is available to Free and Go users via the “Thinking” feature in the + menu. For all other users, GPT-5.4 mini is available as a rate limit fallback for GPT-5.4 Thinking.

For Plus, Pro, and other paid users, GPT-5.4 mini will be used as a fallback for GPT-5.4 Thinking when rate limits are reached, helping with continued access to reasoning capabilities during high usage. Enterprise customers will retain the option to default Auto routing to GPT-5.4 mini, if preferred.

GPT-5.4 mini will not appear as a selectable model in the model picker. Learn more in our [blog post](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/).

## **March 17, 2026**

## **Updates to the model picker in ChatGPT**

We’ve simplified the model picker to make it easier to choose the right level of reasoning.

Users on Plus, Pro, Business, Enterprise, and Edu accounts will see a set of model options depending on their plan, including:

*   **Instant** – fast responses for everyday questions

*   **Thinking** – deeper reasoning for more complex tasks

*   **Pro** – the most advanced reasoning models

The Auto functionality can be accessed by clicking **Configure**in the model picker menu and choosing "Auto-switch to thinking.” This setting will automatically be on if your last chat was set to Auto.

### **Configure more advanced settings**

If you want more control, click **Configure** to:

*   Turn **automatic switching** between Instant and Thinking on or off

*   Access **legacy models**

*   Set **thinking effort**when Thinking or Pro is selected

We’ve also simplified the **retry menu**, making it easier to regenerate responses with Thinking or Pro models by clicking on the three dots underneath the response.

## **March 13, 2026**

## **Write actions for Google and Microsoft Apps in ChatGPT**

We've updated scopes and actions in Google and Microsoft apps in ChatGPT to include support for write actions. You can now use apps like Microsoft Outlook email to draft emails for you, Google docs and sheets to create spreadsheets or docs, or setup meetings using the respective calendar apps.

Write actions remain disabled by default until workspace admins enable them in **Settings > Apps > Manage actions** per app. For Microsoft apps, some customers may also need Microsoft Entra admin approval for updated scopes before new users can connect successfully. Learn more in the Help Center: [Apps in ChatGPT](https://help.openai.com/en/articles/11487775), [Microsoft Outlook app for ChatGPT](https://help.openai.com/en/articles/12512241-outlook-email-and-calendar-app-for-chatgpt), [Microsoft Calendar app for ChatGPT](https://help.openai.com/en/articles/12512241-outlook-email-and-calendar-app-for-chatgpt), and [Microsoft Teams app for ChatGPT](https://help.openai.com/en/articles/12552368-microsoft-teams-app-for-chatgpt).

## March 12, 2026

## Workspace analytics

A refreshed analytics experience, entitled **Workspace analytics**, is now available for ChatGPT Enterprise and Edu. Workspace analytics, replacing **User analytics**, introduces workspace-level analytics to help admins understand adoption, engagement, and how teams use ChatGPT across their organization.

Key highlights:

*   **Refreshed analytics experience:**Updated visuals and navigation, including new tabs that surface insights on how teams use ChatGPT and the outcomes it delivers.

*   **Benchmark comparisons**: Compare adoption and engagement metrics against an industry median.

*   **Impact**: Understand self-reported outcomes such as productivity, time saved, work quality, and work satisfaction through surveys sent to users.

    *   Note: The **Impact** tab will only be enabled for **Enterprise** workspaces (not Edu) upon release.

*   **Task insights**: View aggregated patterns of work in ChatGPT, including task categories and conversation topics.

Additionally, a new user type, _analytics viewer_, allows designated workspace members to view workspace analytics alongside workspace owners and admins.

**_Note:_**_Task Insights and user-distributed impact surveys are_**_enabled by default._**_Workspace admins and owners may opt out of one or both of these features. Workspaces_**_will have approximately 2 weeks_**_from initial release to opt out before surveys may be sent to users._

For more information and an overview of the **Workspace analytics** feature, see: [Workspace analytics for ChatGPT Enterprise and Edu](https://help.openai.com/articles/10875114).

For guidance on how to operationalize these insights (playbooks, enablement motions, champion programs), see our Academy guide: [ChatGPT Enterprise workspace analytics guide](https://academy.openai.com/public/clubs/admins-6o6xf/resources/chatgpt-enterprise-user-analytics-guide).

## **March 11, 2026**

## **Updated scopes for Microsoft apps**

We updated the scopes requested by the [Outlook Calendar](https://help.openai.com/en/articles/12512241), [Outlook Email](https://help.openai.com/en/articles/12512241), [Microsoft SharePoint](https://help.openai.com/en/articles/12143177) and [Microsoft Teams](https://help.openai.com/en/articles/12552368) apps to support additional actions. Microsoft Entra admins will need to review and approve the updated app scopes before new users connect - users may hit connection issues, otherwise.

Note that the new scopes do not automatically make available (or enable) new actions for these apps (including any write actions). Workspace admins and owners will need to review available app actions by locating the app entry in **Workspace settings > Apps**, and then clicking **Manage actions**.

New actions, when made available, are disabled by default - admins/owners can review and then enable actions if appropriate for their workspace.

## Retiring GPT-5.1 models

As of March 11, 2026, GPT-5.1 models are no longer available in ChatGPT.

This applies to GPT-5.1 Instant, GPT-5.1 Thinking, and GPT-5.1 Pro. Existing conversations that used GPT-5.1 will automatically continue on the corresponding current model: GPT-5.3 Instant, GPT-5.4 Thinking, or GPT-5.4 Pro.

## **March 6, 2026**

## **Skills beta for ChatGPT Enterprise and Edu**

We’re introducing **Skills**, a new way for teams to turn proven workflows into reusable instructions that ChatGPT can apply automatically. Skills define when to use a workflow, the steps to follow, and the format of the result—so teams get consistent outputs without repeating the same instructions in every prompt.

Skills can be shared across a workspace and automatically applied in conversation when relevant. For Enterprise and Edu, admins can manage who can create, share, and install skills using role-based controls. Skills are currently in beta and are off by default for Enterprise and Edu workspaces. Admins can enable them at any time.

## **March 4, 2026**

## **Codex app on Windows**

Codex app is now available on Windows for ChatGPT Enterprise and Edu workspaces that include Codex. Members can run multiple Codex agents in parallel from a Windows desktop surface, with isolated worktrees and reviewable diffs that stay interoperable with Codex in the CLI and IDE.

Admins do not need to set up separate app-specific permissions for the app. Codex Local permissions continue to govern local usage, and Codex Cloud permissions govern delegated cloud tasks from the app and other cloud-based Codex surfaces. Learn more: [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan).

## **March 3, 2026**

## **GPT-5.3 Instant Update**

GPT‑5.3 Instant delivers more accurate answers, richer and better-contextualized results when searching the web, and reduces unnecessary dead ends, caveats, and overly declarative phrasing that can interrupt the flow of conversation. GPT-5.3 Instant is default off for ChatGPT Enterprise and Edu workspaces - Admins can enable it via the **Early Model Access toggle** in workspace settings in the “Models” section.

This update focuses on the parts of the ChatGPT experience people feel every day: tone, relevance, and conversational flow. These are nuanced problems that don’t always show up in benchmarks, but shape whether ChatGPT feels helpful or frustrating. GPT‑5.3 Instant directly reflects user feedback in these areas.

## **February 27, 2026**

### **Web**

*   **Edit messages with images.**You can now edit messages that include image attachments, so you don’t have to start over to adjust your prompt or regenerate results.

*   **Open search results in a new tab.**Cmd+click in the search panel now opens results in a new tab, making it easier to explore without losing your place.

*   **Faster sharing.**Sharing chats is now easier and faster, with a quicker-loading share menu.

*   **Export visuals from Code Blocks.**Flowcharts, diagrams, and data visualizations created in Code Blocks can now be exported as images for easy reuse.

### **Android**

*   **Automatic scroll to latest message.**Existing conversations now automatically scroll to the bottom, so you can jump right back in.

*   **Faster sidebar actions.**Sidebar interactions, such as renaming chats, are now faster and more responsive.

*   **Improved dictation visuals.**Dictation now has a clearer, more streamlined interface that keeps your text visible and updates as you speak.

*   **Keyboard opens automatically when attaching files.**The keyboard now opens automatically after you attach a file, helping you continue your message seamlessly.

### **Bug fixes**

*   Fixed increased message streaming errors in GPT-5.2 Thinking

*   Fixed a flicker affecting the Voice Mode button when opening a conversation

*   Sidebar actions on mobile web no longer stick while scrolling

## **February 23, 2026**

## Projects: Chats and Sources tabs

We’re updating projects with a new tabbed layout to so you can easily access sources alongside your chats:

*   Projects now have two tabs: Chats and Sources

*   Project files have moved from Project settings to the Sources tab.

*   Files in Sources can now be sorted by Newest, Oldest, or Alphabetical.

## February 20, 2026

## **Data Residency for Google Drive and GitHub apps with sync**

Google Drive and GitHub apps with sync now support in-region data residency for ChatGPT Enterprise/Edu for all supported data residency regions. Previously, data residency for these apps was only supported in the US. This launch includes both Google Drive user-auth sync and workspace-auth sync. Learn more about [data residency.](https://help.openai.com/en/articles/9903489-data-residency-and-inference-residency-for-chatgpt)

## **February 19, 2026**

## Retiring GPT-5 legacy models

As [previously announced](https://openai.com/index/retiring-gpt-4o-and-older-models/), we are also retiring GPT-5 (Instant and Thinking),[as previously announced](https://openai.com/index/gpt-5-1/). There are no API changes at this time. For details, see our [blog post](https://openai.com/index/retiring-gpt-4o-and-older-models/) and [Help Center](https://help.openai.com/en/articles/20001051-retiring-gpt-4o-and-other-chatgpt-models).

## Interactive Code Blocks in ChatGPT

We improved Code Blocks in ChatGPT to make them more interactive.

You can write, edit, and preview your code in ChatGPT, all in one

place:

*   Write and edit text in-line

*   Preview diagrams and mini apps directly in chat

*   Review code in split-screen views

## February 10, 2026

## **Updates to deep research**

We’re introducing improvements to deep research in ChatGPT to help produce more accurate, credible reports with greater control. You can now focus research on specific websites and a larger collection of connected apps as trusted sources.

A redesigned sidebar entry point and fullscreen report view make it easier to start, review, and manage research in one place. Create and edit a research plan before it begins, and track progress with the ability to adjust direction mid-run.

For Enterprise and Edu workspaces, this update does not modify your current role-based access controls (RBAC) or the default deep research configuration.

For more information, please refer to our help center article: [Deep research in ChatGPT](https://help.openai.com/articles/10500283)

## February 2, 2026

## Introducing the Codex App

Today we’re releasing the Codex app for MacOS, a command center for managing multiple coding agents in parallel. The app lets you run long‑horizon and background tasks, review clean diffs from isolated worktrees, see agent progress and decisions, and execute reusable skills and automations.

The Codex app follows the same admin controls as Codex local and Codex cloud. Codex local must be enabled for members to use the Codex app. Admins/owners can control Codex access from [Workspace settings](https://chatgpt.com/admin/permissions) -> Permissions & roles, with [RBAC](https://help.openai.com/en/articles/11750701-rbac), and can use the [compliance API](https://help.openai.com/en/articles/9261474-compliance-api-for-enterprise-customers) to manage and log Codex usage.

For a limited time, Enterprise/Edu users without flexible pricing receive 2x Codex rate limits. Enterprise/Edu users with flexible pricing qualify for a special promotion, [contact sales](https://help.openai.com/en/articles/9047878-how-can-i-contact-sales)to learn more.

Get started by [downloading](https://chatgpt.com/codex) the macOS app, and [learn more](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) about Codex.

## **January 30, 2026**

## **More models for GPTs with custom actions**

GPTs with custom actions can now use more models in the model picker, including GPT-5.2 Instant and GPT-5.2 Thinking. o-series and Pro models aren’t supported for custom actions. Model availability depends on what your admin has enabled for your workspace.

Previously, GPTs with custom actions could only use GPT-4o, GPT-4.1, and GPT-5 Instant.

## December 18 2025

## Introducing the app directory in ChatGPT

You can now browse and add approved apps in the new [**app directory**](https://chatgpt.com/apps). Apps let you work with your tools and data directly inside a conversation—from interactive in-chat experiences to secure connections that allow ChatGPT to search and reference information from third-party services.

As part of this update, [**connectors now appear in the directory as apps**](https://help.openai.com/en/articles/11487775-apps-in-chatgpt), making it easier to manage all your tools in one place. References across the Help Center have been updated to reflect this new terminology.

For ChatGPT Enterprise and Edu, apps are disabled by default. Admins and owners can control which apps are available to users using role-based access controls and set which actions each app is allowed to take through

[workspace settings](https://chatgpt.com/admin/ca)
.

Apps are available to all logged-in ChatGPT users, with availability and functionality varying by plan and region. Some apps or capabilities may not be available in certain regions (including the EEA, GB, or Switzerland) or may require specific plan tiers.

Additionally,

[developers can submit apps for review and publication](https://openai.com/index/developers-can-now-submit-apps-to-chatgpt/)
in the app directory, making approved apps available to a broader set of ChatGPT users.

## December 15, 2025

## Apps & connectors admin UI refresh

We’ve refreshed the Apps & connectors section in Workspace settings for admins and owners with a clearer layout: tabs for Enabled, Available, and Draft; a streamlined list view; search and filters; and bulk actions like selecting multiple apps to manage roles or disable. Enabling actions, including sync where supported, now live directly in each connector’s listing.

Available to ChatGPT Enterprise/edu admins in [Workspace settings](https://chatgpt.com/admin/ca). Note that Apps and connectors are disabled by default for Enterprise/Edu plans - enable connectors from the **Available** tab, setup sync, [RBAC](https://help.openai.com/en/articles/11750701-rbac), and configure MCP actions (depending on app/connector).

Read more about[apps](https://help.openai.com/en/articles/12503483-apps-in-chatgpt-and-the-apps-sdk) and[connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## December 11, 2025

### **GPT-5.2 in Early Access for Enterprise**

This week, we’re rolling out GPT-5.2, the most capable model series yet for professional knowledge work with improved work artifact creation like spreadsheets, tool use and longer context retrieval. As with GPT-5.1, we’re continuing to improve our main models for everyone on a regular basis to make them more useful and enjoyable to use.

We’re releasing GPT-5.2 to Enterprise and Edu workspaces in **Early Access**, meaning you can turn it on now for your workspace in

[admin settings](https://chatgpt.com/admin/permissions)
, where you can also manage access to legacy models. We’ll be transitioning custom GPTs to GPT-5.2 on January 12, 2026, and we recommend GPT creators switch as early as possible.

[Learn more about custom GPTs.](https://help.openai.com/en/articles/8555535-gpts-chatgpt-enterprise-version#models-and-custom-actions)

The credits for GPT-5.2 will remain the same as GPT-5. See the current [ChatGPT rate card](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterpriseedu) for pricing information.

### **The ChatGPT Compliance API is now part of the OpenAI Compliance Logs Platform**

The OpenAI Compliance Logs Platform is a new, unified way for enterprises to export observability and compliance data via immutable, time-windowed JSONL log files. The Compliance Logs Platform is also now available with Audit, Auth, and Codex logs.

It helps deliver improved reliability, minutes-level latency, and a single ingestion pattern across multiple log categories, including the brand-new ChatGPT Audit & Authentication Logs and Codex Usage Logs. These logs make it possible to audit changes made to workspaces, track authentication activities, and understand Codex usage.

[Learn more](https://help.openai.com/en/articles/9261474-compliance-api-for-enterprise-customers)
.

## December 3, 2025

## Adding the Atlassian Rovo MCP connector

We’re adding Atlassian Rovo to our list of MCP connectors, which brings in your Jira, Compass, and Confluence information to bring relevant project context into your chats. This connector enables you to take supported write actions in Jira right from ChatGPT — such as creating issues and triggering workflows—based on what you request and on patterns identified in your project data. All actions are initiated, approved and completed directly in chat.

Admins can review actions and other basic information about the connectors in **Workspace settings → Apps**, and set user permissions using [RBAC](https://rbac/). Users can add the Atlassian Rovo from **Settings → Apps & Connectors**.

The Atlassian Rovo connector is available to Enterprise, Edu, Business, Pro and Plus customers with connectors enabled for their workspace.

## November 25, 2025

## Model updates for Enterprise and Edu

GPT-5.1 Instant is now live in the model picker for ChatGPT Enterprise and Edu workspaces, and GPT-5.1 Auto and GPT-5.1 Thinking are no longer available as Early Access options.

GPT-5.1 Pro is now available in Early Access for Enterprise and Edu. Admins and owners can enable access in your [workspace's settings](https://chatgpt.com/admin/permissions). GPT-5.1 Pro is intended for more complex tasks where more reasoning is helpful.

New custom GPTs created in Enterprise and Edu will begin using GPT-5.1 as the default model. Existing custom GPTs are unchanged, and creators can still select a different model (depending on what’s enabled for the workspace and role).

## November 24, 2025

## New MCP connectors available today

We’re rolling out a new set of MCP access connectors built by partners and reviewed by OpenAI, including **Amplitude, Fireflies, Vercel, Monday.com, Stripe, Hex, Egnyte, Alpaca, BioRender, Semrush, and Jam.dev**. This is available to Enterprise, Edu, Business, Pro and Plus customers with connectors enabled for their workspace. These connectors expand the set of tools customers can bring into ChatGPT and will be followed by additional connectors on a rolling basis.

The connectors released today are **access connectors**, which fetch content when a user asks a question, built using MCP. Admins continue to govern access to connectors using RBAC. Connectors remain default off for Enterprise plans, and default on for Business plans.

Admins can review **Actions** and other basic information about these connectors in **Workspace settings → Apps**.

## November 19, 2025

## Custom connectors in company knowledge

Starting today, company knowledge will support custom MCP connectors with search/fetch functionality. Custom connectors fitting this criteria that are enabled for your organization will appear in the company knowledge experience for allowed users, giving your team a more complete, accurate, and company-specific context when using the feature.

Admins/owners can continue to manage access to custom connectors through [RBAC](https://help.openai.com/en/articles/11750701-rbac) in Workspace settings.

Learn more about [company knowledge](https://help.openai.com/en/articles/12628342-company-knowledge-in-chatgpt-business-enterprise-and-edu) and [custom MCP connectors](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta).

## November 12, 2025

## GPT-5.1 in ChatGPT

We’re updating GPT-5 to GPT-5.1 Instant and GPT-5.1 Thinking, making answers both smarter and more conversational. GPT-5.1 Instant now uses light adaptive reasoning for tougher questions while staying fast, and GPT-5.1 Thinking adapts its thinking time more precisely for complex tasks with clearer, less jargony responses.

GPT-5.1 Auto continues to route each query to the best model, and GPT-5 models remain available for three months under the Legacy models dropdown so you can compare and transition at your own pace.

Please note that access to GPT-5.1 is by default disabled for ChatGPT Enterprise workspaces. Admins and owners can enable access in their [**workspace settings**](https://chatgpt.com/admin/permissions).

## November 13, 2025

## Apps & Apps SDK now available to Enterprise/Edu plans

ChatGPT Enterprise/Edu customers will now have access to ChatGPT apps. Apps include interactive interfaces – like presentations, maps, and playlists – that respond to natural language and adapt to your conversation. You can start with a bulleted outline and ask Canva to turn it into a professional presentation, or turn a rough sketch into a FigJam diagram—all without leaving ChatGPT.

Our pilot partners—like Figma, Canva, Booking.com, Coursera, Expedia, Spotify, and Zillow—will be available to Enterprise/Edu customers in markets where their services are offered, starting in English, with more apps coming.

You can also build your own apps with the [Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk), then test and deploy it for your team using [developer mode](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta). Get started in the docs. Learn more: [Apps in ChatGPT and the Apps SDK](https://help.openai.com/en/articles/12503483-apps-in-chatgpt-and-the-apps-sdk) and [Build with the Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)

## Synced Connector Updates

ChatGPT Enterprise/Edu workspaces can now use ChatGPT connectors for [Azure Boards](https://help.openai.com/en/articles/12628387-azure-boards-synced-connector), [Basecamp](https://help.openai.com/en/articles/12628389-basecamp-synced-connector), and [Zoho CRM](https://help.openai.com/en/articles/12825765-zoho-crm-synced-connector) These connectors deliver faster, higher-quality answers–especially for knowledge-heavy prompts like strategy summaries, policy lookups, and internal research.

For Enterprise/Edu workspaces, connectors are disabled by default— admins and owners can enable specific connectors at any time from their [Workspace connectors settings](https://chatgpt.com/admin/ca), and configure connector access through [RBAC](https://help.openai.com/en/articles/11750701-rbac). Individual users can connect enabled connectors they want to use from **Settings > Apps & Connectors**. Once enabled, ChatGPT will automatically reference the indexed content when relevant. Learn more about how to use connectors [here](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## November 6, 2025

## Custom connector action controls

Admins and Owners can now enable or disable individual actions for custom connectors (e.g., to allow _read_ but not _write)_ and manually refresh actions to pick up developer updates. This brings finer control over what connectors can do in ChatGPT and a simple review path when new connector capabilities are added. Find these controls in **Workspace Settings → Connectors → Manage actions** or during publish.

Available to ChatGPT Enterprise and Edu workspaces using custom connectors. Toggles apply at the workspace level; new actions are disabled by default until approved and modified actions keep their prior state. To use Refresh, an admin/owner must connect to the connector as a user.

[Learn more about these controls in our Help Center article](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta#h_2496ac9f24).

## October 27, 2025

## Synced Connector Updates

Enterprise and Edu workspaces can now use ChatGPT connectors for [Aha!](https://help.openai.com/en/articles/12628380-aha-synced-connector), [Asana](https://help.openai.com/en/articles/12628359-asana-synced-connector), [ClickUp](https://help.openai.com/en/articles/12628397-clickup-synced-connector), [GitLab Issues](https://help.openai.com/en/articles/12628403-gitlab-issues-synced-connector), [Help Scout](https://help.openai.com/en/articles/12628422-help-scout-synced-connector), [Teamwork.com](https://help.openai.com/en/articles/12628436-teamwork-synced-connector), and [Zoho Desk](https://help.openai.com/en/articles/12628448-zoho-desk-synced-connector). Synced connectors deliver faster, higher-quality answers – especially for knowledge-heavy prompts like strategy summaries, policy lookups, and internal research.

Admins and Owners can enable connectors from their [Workspace connectors settings](https://chatgpt.com/admin/ca), and can configure user access using [RBAC](https://help.openai.com/en/articles/11750701-rbac). Connectors remain off by default until an Admin or Owner turns them on. Individual users can connect enabled connectors they want to use from Settings > Apps & Connectors. Once enabled, ChatGPT will automatically reference the indexed content when relevant. Learn more about how to use connectors [here](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## October 23, 2025

## Company knowledge in ChatGPT

Company knowledge is a new way to bring together context from all your [connected tools](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) for answers that know your business, with citations and links back to sources from your apps (for example: Slack, SharePoint, Google Drive, GitHub, Notion, HubSpot, Zendesk, Azure DevOps, Asana, and more).

Company knowledge respects your existing company permissions, so ChatGPT only has access to what each user is already authorized to view. It follows the role-based permissions admins have set for each connector. OpenAI never trains on your data by default. [Learn more](https://openai.com/business-data/) about OpenAI's enterprise-grade security, compliance, and data privacy programs.

Admins enable connectors for the workspace and can manage access with [RBAC](https://help.openai.com/en/articles/11750701-rbac). At least one connector must be enabled for a user to see company knowledge.

To use it, start a chat, select company knowledge under the message composer, and ask your question to see cited results from approved connectors. Learn more in our [Help Center article](https://help.openai.com/en/articles/12628342-company-knowledge-in-chatgpt-business-enterprise-and-edu).

## October 17, 2025

## Build, upload, and publish MCP connectors in ChatGPT [Beta]

We’re rolling out full Model Context Protocol (MCP) support with developer mode so your organization can build, test, and publish MCP-powered [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) with read/write capabilities that let ChatGPT take action in your tools. Kick off workflows, create project management tasks, update your CRM, or combine connectors for more complex orchestrations.

Admins can review and publish connectors to the workspace, and use [RBAC](https://help.openai.com/en/articles/11750701-rbac) to control who can develop, test, and use each connector. Build your own MCP connector, or upload trusted third party connectors.

Learn more in our [Help Center article](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta).

## October 16, 2025

## Updated Workspace settings

We’ve updated Workspace settings to make administration clearer and faster. A new **General** tab now centralizes workspace customization (name, logo, appearance, and workspace-wide instructions) and adds an **AI policy modal** you can configure to remind users of your organization’s AI policies on a recurring basis.

We’ve also streamlined navigation by combining Identity & provisioning with IP allowlists into a new **Identity & access tab**, and by renaming Settings & permissions to **Permissions & roles.**

See [What workspace settings can I control for my workspace](https://help.openai.com/en/articles/8411955-what-workspace-settings-can-i-control-for-my-workspace) for details.

## Enterprise Key Management (EKM)

Enterprise Key Management (EKM) is now available for Enterprise and Edu customers. This capability allows organizations to encrypt all customer content using their own external Key Management System (KMS), giving organizations greater control over data security and compliance.

EKM supports integrations with Google Cloud Platform (GCP), Amazon Web Services (AWS), and Microsoft Azure.

Read our [OpenAI Enterprise Key Management (EKM) Overview](https://help.openai.com/articles/20000943) to get started.

Note that EKM will be initially available for ChatGPT Enterprise and Edu workspaces, and will be available for the OpenAI API in the coming weeks.

## October 13, 2025

## Introducing the ChatGPT app & connector for Slack

We’re rolling out two new ways to bring Slack and ChatGPT together: a [connector](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) that brings your Slack context into ChatGPT, and a ChatGPT app for Slack – an integration that enables you to chat with ChatGPT from inside Slack.

With the [**ChatGPT app for Slack,**](https://intercom.help/openai/en/articles/12462158-chatgpt-app-for-slack) you can chat one-on-one with ChatGPT in a dedicated Slack sidebar – a space to ask questions, summarize long threads into action items, draft replies, and search messages and files you already have access to. Chats you start in Slack also appear in your ChatGPT sidebar, so it’s easy to pick up later from web or mobile. Semantic search is supported for Slack customers with AI enabled on Business+ or Enterprise+ plans; all other plans use keyword search.

With the [**ChatGPT connector for Slack**](https://intercom.help/openai/en/articles/12525822-chatgpt-connector-for-slack)**,** you can securely bring in context from your Slack channels and DMs, making responses more helpful Available in chat, Deep Research, and Agent Mode. Admins can enable the connector from their [Workspace connectors settings](https://chatgpt.com/admin/ca), and can configure user access by [RBAC](https://help.openai.com/en/articles/11750701-rbac). Users can enable the connector from **Settings > Apps & Connectors**.

Both app and connector are available to **Plus, Pro, Business and Enterprise/Edu** customers. Additionally, the ChatGPT app for Slack requires a **paid Slack account;** availability and workspace installation may depend on your Slack workspace settings.

Installing the app requires the connector to be enabled for your account.

Visit the [**ChatGPT app for Slack**](https://intercom.help/openai/en/articles/12462158-chatgpt-app-for-slack) page to get started with installation.

We additionally added the [Intercom synced connector](https://help.openai.com/en/articles/12562556-intercom-synced-connector), which allows you access and interact with your Intercom data—including conversations, tickets, and help center content.

## October 9, 2025

## Connector Updates

Enterprise and Edu workspaces can now use an **admin-managed sync connector for SharePoint**. Admins authenticate once and deploy at workspace scale—choosing to sync all sites or specific folders via a file picker—while ChatGPT enforces existing SharePoint permissions. Users are matched by email and only see files they already have access to, with no per-user setup required. Connections can be enabled, updated, or removed at any time. Read more in our [SharePoint Connector Help Center article](https://help.openai.com/en/articles/12143177-sharepoint-connectors-on-chatgpt).

We’re also adding [**Notion**](https://help.openai.com/en/articles/12532955-notion-synced-connector) and [**Linear**](https://help.openai.com/en/articles/12526595-linear-synced-connector) as [synced connectors](https://help.openai.com/en/articles/10847137-chatgpt-synced-connectors), so teams can securely bring Notion pages and Linear issues/discussions into Chat for fast answers and summaries.

All three connectors are managed in ChatGPT workspace [**Admin connectors settings**](https://chatgpt.com/admin/ca) in the **Synced connectors** section ([RBAC](https://help.openai.com/en/articles/11750701-rbac) supported). Once enabled, ChatGPT will automatically reference the indexed content when relevant.

## October 6, 2025

## Updates to Codex

We’re rolling out new Codex capabilities to help teams work and build better: [Codex now works in Slack](https://developers.openai.com/codex/integrations/slack), and supports programmatic control through the [Codex SDK](https://developers.openai.com/codex/sdk). We’ve also added new admin controls and analytics so workspace admins can manage Codex Cloud environments, set safe defaults for CLI/IDE usage, and monitor usage with improved dashboards. Additionally, [Codex rates](https://help.openai.com/en/articles/11481834-chatgpt-rate-card#h_e8c3d8c100) have been updated.

For more information, review our Help Center article on [Codex](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan), and the [Codex developer documentation](https://developers.openai.com/codex).

## October 3, 2025

## GPT-5 Auto routing control for reasoning

Enterprises on [flexible pricing](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) can now adjust how **GPT-5 Auto** handles reasoning requests. When enabled, these requests will route to **GPT-5 Thinking Mini** instead of **GPT-5 Thinking**.

If your workspace or custom roles have **GPT-5 Thinking** enabled, members can still manually select it from the model picker at any time.

Learn more about how to enable this setting in [ChatGPT Enterprise and Edu - Models & Limits](https://help.openai.com/en/articles/11165333-chatgpt-enterprise-and-edu-models-limits).

## September 25, 2025

## Introducing project sharing

Today, we’re announcing an update to [projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt). Now you can share projects with teammates in your workspace, adding files and instructions together to guide ChatGPT’s responses toward a shared goal. Members can chat with the project’s context to stay on the same page as new information gets added and create work that stays consistent in tone.

Shared projects are ideal for ongoing work like client management, content creation, reporting, and research.

Invite members in your workspace by individual email, group email, or shared link. Add/remove project members, set project access permissions, create new chats, add/remove files, and allow members to bring existing chats into the project. Memory is project-only, ensuring sensitive data stays safely within the project.

For more information, see our help center article on [project sharing](https://help.openai.com/en/articles/10169521-projects-in-chatgpt#h_e8f291686b).

_Note: Shared projects include a 4-week early access period until October 23, 2025. They’re off by default during this time. You can enable access for specific roles anytime with role-based access controls (RBAC), or keep the feature off for your entire workspace in Settings. If you take no action, the feature turns on for everyone when early access ends, following any RBAC settings you’ve set. Learn more_[_here_](https://help.openai.com/en/articles/10169521-projects-in-chatgpt#h_542cf9638f)_._

## September 15, 2025

## Updates to Codex

We’re adding GPT-5-codex, a GPT-5 variant optimized for agentic coding in Codex. It’s available everywhere you use Codex: default for cloud tasks and code review, and selectable for local workflows via the Codex CLI and IDE extension. Use GPT-5-codex for coding-focused work in Codex, or Codex-like environments; use GPT-5 for general, non-coding tasks. Please review the [announcement](https://openai.com/index/introducing-upgrades-to-codex/) blog for more information.

_Note: GPT-5-Codex is not currently supported in ChatGPT or the API._

To learn more about Codex, visit the [developers site](http://developers.openai.com/codex) as well as our general help article: [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540).

## September 4, 2025

## Website blocking for ChatGPT agent

Enterprise and Edu workspace owners can now request to block specific websites or entire domains (including all subdomains) from ChatGPT agent browsing and actions.

If you would like a blocklist set up for your workspace, contact your OpenAI Account Director or Customer Success Manager.

If you do not have an account team, please [contact OpenAI Support](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).

Learn more about [website blocking in ChatGPT agent](https://help.openai.com/en/articles/11752874-chatgpt-agent#h_a916076c08).

## September 3, 2025

## Sharepoint sync connector

Enterprise and Edu workspaces can now use the [Sharepoint synced connector](https://help.openai.com/en/articles/10847137-chatgpt-synced-connectors-faq), which enables workspace members to securely ask questions and get answers directly from their OneDrive and SharePoint files. Connections can be created, deleted, or modified at any time. Once enabled, ChatGPT will automatically reference your SharePoint content when relevant.

ChatGPT Enterprise workspace Admins must enable access to the Sharepoint connector and the Sharepoint _sync connector_ in their workspace’s [Admin connectors settings](https://chatgpt.com/admin/ca). Once this is enabled, each user can connect their individual account by signing in to SharePoint through an OAuth flow. [Admins can further configure access settings with RBAC.](https://help.openai.com/en/articles/11750701-rbac)

[Learn more about setting up the Sharepoint synced connector for your workspace.](https://help.openai.com/en/articles/12143177-sharepoint-synced-connectors-setup)

## IP allowlisting

Enterprise and Edu workspaces can now enable **IP allowlisting** to control which IP addresses can access ChatGPT and the Compliance API. When enabled, only users from the IPs you specify will be allowed access. Any request from an unlisted IP will be blocked, even if the user has valid credentials.

This feature applies to all ChatGPT endpoints, including authenticated file downloads and Compliance API keys. For Compliance API traffic, IP Allowlisting is always enforced and cannot be turned off.

**Note:** IP Allowlisting is specific to **ChatGPT**. It does **not** apply to the API Platform ([platform.openai.com](https://platform.openai.com/?utm_source=chatgpt.com))

Workspace owners and admins can manage allowlists in a new tab in **Workspace Settings** entitled **IP allowlist**.

Learn how to set up and manage IP allowlisting in our article: [IP allowlisting for ChatGPT](https://help.openai.com/en/articles/12111596-ip-allowlisting-for-chatgpt)

## August 28, 2025

## GitHub connector access for Enterprise and Edu

Enterprise and Edu workspaces globally can now use the GitHub [synced connector](https://help.openai.com/en/articles/10847137) and [chat connector](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt#h_584a7d13e3) in ChatGPT, in addition to the GitHub deep research connector.

The synced connector pre‑indexes your organization’s GitHub repositories, enabling faster and higher‑quality contextual responses about code, commits, and pull requests—making it the recommended option for improved quality.

For detailed setup steps, including how to exclude certain repositories, see [Connecting GitHub to ChatGPT](https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt). Access to connectors can be managed through ChatGPT’s [RBAC controls for connectors](https://help.openai.com/en/articles/11509118-admin-controls-security-and-compliance-in-connectors-enterprise-edu-and-team#h_227601b351).

Learn more about [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## RBAC for connectors

Role-based access controls (RBAC) now extend to connectors. Enterprise and Edu workspaces can assign connector access directly to custom roles, giving admins greater flexibility when managing permissions across teams.

For a walkthrough on how to configure RBAC for connectors, please refer to our article here: [Admin Controls, Security, and Compliance in Connectors](https://help.openai.com/en/articles/11509118-admin-controls-security-and-compliance-in-connectors-enterprise-edu-and-team#h_227601b351)

Learn more about [RBAC](https://help.openai.com/en/articles/11750701-rbac).

## Gmail, Google Calendar, and Google Contacts connectors in ChatGPT

Gmail, Google Calendar, and Google Contacts are now available to connect and use in chat. Once you enable them, ChatGPT will automatically reference them when relevant, making it faster and easier to bring information from these tools into your conversations without having to manually select them each time.

If you already have Gmail or Google Calendar enabled for deep research, you can now also use them in chat. To use them in deep research, you will still need to enable each connector separately and select it every time you start a new deep research request.

Learn more about [**connectors**](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## August 27, 2025

## Updates to Codex

Starting today, Codex works with you everywhere you build—in your terminal or IDE, on the web, in GitHub, and even from the ChatGPT iOS app. Your ChatGPT account connects it all, so you can work seamlessly between your local environment and Codex’s cloud without losing state.

We’re excited to introduce the latest Codex updates:

*   **IDE Extension:** The new extension brings codex into VS Code, Cursor, and other VS Code forks, so that you can seamlessly preview local changes and edit code

*   **Sign in with ChatGPT:** Available in both the IDE and CLI, eliminating API key setup and providing access directly through your existing ChatGPT plan

*   **Seamless Local ↔ Cloud Handoff:** Developers can pair with Codex locally and then delegate tasks to the cloud to execute asynchronously without losing state

*   **Upgraded Codex CLI:** Refreshed UI, new commands, and bug fixes

*   **Code reviews in GitHub:** Set up Codex to automatically review new PRs in a repo, or mention @codex in PRs to get reviews and suggested fixes

Additionally, all product information and updates for Codex moving forward will be announced on our new site: [developers.openai.com/codex](http://developers.openai.com/codex). The Codex Enterprise Admin Guide is also now available on this site: [developers.openai.com/codex/chatgpt-enterprise](https://developers.openai.com/codex/chatgpt-enterprise)

We invite you to explore the site for more details on these new features, as well as guides on how to get started.

To learn more about Codex, visit the new [developers site](http://developers.openai.com/codex) as well as our general help article [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540).

## August 22, 2025

## Project-only memory

An improvement to [projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) is now available. When creating a project, users have the option to enable **project-only memory.**

With **project-only memory** enabled, ChatGPT can use other conversations in that project for additional context, and won’t use your [saved memories](https://help.openai.com/en/articles/11146739-how-does-reference-saved-memories-work) from outside the project to shape responses. Additionally, it won’t carry anything from the project into future chats outside of the project.

This creates a focused, self-contained space, which is useful for long-running or sensitive work where you want ChatGPT to stay anchored to that project’s tone, context, and history.

Note:

*   **Personal Memory** must be enabled to utilize this feature.

*   **Settings** ->**Personalization** ->**Memory**

*   **Workspace Memory must be enabled to utilize this feature.**

*   Workspace owners can enable this by **Workspace Settings** ->**Memory**

*   This feature will initially only be available on the ChatGPT website and Windows app. Support for mobile (iOS and Android) and macOS app will follow in the coming weeks.

Learn more about [memory in projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt#h_374a3efb05).

## August 14, 2025

## Study Mode

Study mode is now available to ChatGPT Enterprise users. Study mode works with any model available in ChatGPT on iOS, Android, web, and desktop.

Study mode is a new learning experience in ChatGPT designed to help you build a deeper understanding of any topic. When you turn it on, ChatGPT will ask interactive questions to understand your goals and skill level, then work with you to reach the answer together.

With Study mode enabled, ChatGPT can:

*   Guide understanding with Socratic-style questions.

*   Break concepts into easy to follow sections starting simple and adding complexity as you progress.

*   Personalize responses based on your past chats if memory is on, using examples and tips tailored to you.

*   Check your understanding with open-ended prompts and feedback.

*   Work with your materials by referencing images or PDFs you upload.

You can enable study mode at any time by selecting **Tools** in the prompt window and choosing **Study and learn** from the drop‑down menu or go to [**chatgpt.com/studymode**](http://chatgpt.com/studymode).

Study mode is powered by custom system instructions and can have some inconsistent behavior and mistakes across conversations. We plan on training this behavior directly into our main models once we’ve learned what works best through iteration and user feedback.

[**Learn more about study mode.**](https://help.openai.com/en/articles/11780217)

## August 12, 2025

## GPT-5

GPT-5 in ChatGPT is our next flagship model and the new default for all logged-in users. It simplifies ChatGPT to a single auto-switching system that brings together the best of our previous models into a **smart, fast model.**

ChatGPT Enterprise and Edu workspaces have flexibility in how legacy models are made available. Workspace admins can enable additional legacy models (GPT-4.1, GPT-4.5, OpenAI o3, o3-pro, and o4-mini) for the entire workspace in their [**admin settings**](https://chatgpt.com/admin). These models [**consume credits**](https://help.openai.com/en/articles/11481834-chatgpt-rate-card), so availability is controlled at the admin level.

[Learn more about ChatGPT Enterprise limits.](https://help.openai.com/en/articles/11165333-chatgpt-enterprise-models-limits)

## August 11, 2025

## Additional connectors

**Now connect even more tools in ChatGPT for useful, relevant responses in chat.**

Microsoft Teams, Outlook email and calendar connectors are now available to search by chat in addition to deep research.

To enable, visit **Settings** → **Connectors**→ **Connect** on the application. Note that connectors are still in beta and defaulted off for Enterprise & Edu plans. Admins can enable them for their workspace in [Settings](https://chatgpt.com/admin/settings).

Learn more about [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt).

## August 8, 2025

## ChatGPT agent

ChatGPT agent is now available for Enterprise and Edu plans. This was previously made available to Plus, Pro, and Team users on July 17, 2025.

ChatGPT agent allows ChatGPT to complete complex online tasks on your behalf. It seamlessly switches between reasoning and action—conducting in-depth research across public websites, uploaded files, and [connected](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) third-party sources (like email and document repositories), and performing actions such as filling out forms and editing spreadsheets—all while keeping you in control.

Learn more in the [ChatGPT agent FAQ](https://help.openai.com/en/articles/11752874-chatgpt-agent).

## August 6, 2025

## Study Mode

Study mode is now available to ChatGPT Edu users. Study mode works with any model available in ChatGPT on iOS, Android, web, and desktop.

Study mode is a new learning experience in ChatGPT designed to help you build a deeper understanding of any topic. When you turn it on, ChatGPT will ask interactive questions to understand your goals and skill level, then work with you to reach the answer together.

With Study mode enabled, ChatGPT can:

*   Guide understanding with Socratic-style questions.

*   Break concepts into easy to follow sections starting simple and adding complexity as you progress.

*   Personalize responses based on your past chats if memory is on, using examples and tips tailored to you.

*   Check your understanding with open-ended prompts and feedback.

*   Work with your materials by referencing images or PDFs you upload.

You can enable study mode at any time by selecting **Tools** in the prompt window and choosing **Study and learn** from the drop‑down menu or go to [**chatgpt.com/studymode**](http://chatgpt.com/studymode).

Study mode is powered by custom system instructions and can have some inconsistent behavior and mistakes across conversations. We plan on training this behavior directly into our main models once we’ve learned what works best through iteration and user feedback.

[Learn more about study mode.](https://help.openai.com/en/articles/11780217)

## July 24, 2025

## Canva and Notion connectors

Enterprise and Edu users can now connect to Canva and Notion for both chat search and deep research.

Learn more about [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt), as well as about [controls, security, and compliance for admins](https://help.openai.com/en/articles/11509118-admin-controls-security-and-compliance-in-connectors-enterprise-edu-and-team).

## Chat search for HubSpot and custom connectors (MCP)

Enterprise and Edu users can now utilize chat search with HubSpot and custom connectors (MCP) in addition to deep research.

Learn more about [connectors](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt), as well as [how to create a custom connector using MCP](https://platform.openai.com/docs/mcp).

## July 17, 2025

## New role-based access controls ('RBAC') in Admin Settings

Starting today, new role-based access controls will begin rolling out to Enterprise/Edu workspaces.

Workspace Owners will gain RBAC functionality within [chatgpt.com/admin/settings](http://chatgpt.com/admin/settings) where they can:

*   Set a default role for members who do not have one or more Custom Roles assigned

*   Create custom roles with granular permissions that override the workspace default role

*   Assign one or multiple Custom Roles to Groups

*   View and manage Custom Roles in a centralized tab

All of our [supported countries](https://platform.openai.com/docs/supported-countries) should have access to this feature.

For all details see our [RBAC help article](https://help.openai.com/en/articles/11750701-rbac).

## June 24, 2025

## Priority Processing in the API

We’re launching **Priority processing** for Enterprise API users. Priority processing offers the same premium latency and uptime SLAs as Scale Tier, but with flexible pay-as-you-go pricing and no provisioning requirements. It’s designed for latency-sensitive, user-facing workloads where consistently fast response times are important.

At launch, Priority processing is available for the following models:

*   GPT-4o, GPT-4o mini

*   GPT-4.1, GPT-4.1 mini, GPT-4.1 nano

*   o3

*   o4-mini

Enterprise customers can select Priority processing on a per-request basis using the service_tier="priority" parameter. Usage is billed separately from Scale Tier commitments. Ramp rate limits apply to protect performance during rapid traffic increases.

Learn more about [Priority processing](https://openai.com/api-priority-processing/) and read [our FAQ](https://help.openai.com/en/articles/11647665-priority-processing-faq).

## Project file limit increased

Projects for Enterprise and Edu users now support up to 40 uploaded files, increased from the previous limit of 20.

## June 18, 2025

## Record mode in ChatGPT macOS desktop app

Capture meetings, brainstorms, or voice notes.

*   ChatGPT will transcribe, summarize, and turn them into helpful outputs like follow-ups, plans, or even code.

*   Available on the macOS desktop app only

Record mode will be disabled by default for all Enterprise and Edu workspaces, and must be enabled by a workspace owner under **Workspace Settings -> Record.**

Learn more about [ChatGPT Record](https://help.openai.com/en/articles/11487532).

Note that record mode rolled out Team users on June 4. Today, it is also enabled for Enterprise and Edu plans.

## OpenAI o3-pro replaces o1-pro in model picker

OpenAI o3-pro will replace o1-pro in the model picker for ChatGPT Enterprise and Edu users. o3-pro is our latest pro model, delivering stronger performance across complex science, programming, business, and education queries.

*   Supports browsing, Python, file analysis, and image reasoning

*   Does not support image generation, canvas, or temporary chats. Continue to use GPT-4o, o3, or o4-mini for those features

Learn more about [o3-pro](https://platform.openai.com/docs/models/o3-pro).

## Adding More Capabilities to Projects

We’re adding several updates to projects in ChatGPT to help you do more focused work.

*   Deep research and voice mode support

*   Sharing chats from projects

*   Starting a new project directly from a chat

*   Upload files and access model selector on mobile

Learn more about [projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt).

Note these improvements rolled out to Plus, Pro, and Team users on June 12. Today, they are also enabled for Enterprise and Edu plans.

## Custom GPTs support all models

Custom GPTs without actions will support all available models in ChatGPT. GPT creators can define a recommended model for their GPT, and users will have the option to switch models while using it.

GPTs with custom actions will continue to support GPT-4o and GPT-4.1 only.

Learn more about [GPTs](https://help.openai.com/en/collections/8475420-gpts).

## June 16, 2025

## Expanded Model Support for Custom GPTs

Enterprise and Edu users can now choose from the full set of ChatGPT models (GPT-4o, o3, o4-mini and more) when building Custom GPTs—making it easier to fine-tune performance for different tasks, industries, and workflows. Creators can also set a recommended model to guide users.

Key details:

*   GPTs _without Custom Actions_ can use the model picker to select from all models available to the user.

*   GPTs _with Custom Actions_ currently support GPT-4o and 4.1

*   Available on web

## June 4, 2025

## Connectors in ChatGPT (Beta)

Customers can now enable connectors to bring internal tools and content into ChatGPT.

*   Supported connectors: Google Drive, SharePoint, Dropbox, and Box

*   Real-time access with in-line citations

*   Admins control connector access in Admin Settings (off by default)

Learn more about [Connectors in ChatGPT](https://help.openai.com/en/articles/11487775).

## Connectors in deep research (Beta)

Use connectors in Deep Research to generate long-form, cited responses that include your company’s internal tools.

*   Supported connectors: Google Drive, SharePoint, Dropbox, Box, Outlook, Gmail, Google Calendar, Linear, GitHub, HubSpot, and Teams

*   Combines internal + web sources for synthesis

Learn more about [Connectors in ChatGPT](https://help.openai.com/en/articles/11487775).

## Google Drive synced connector

The synced connector indexes your organization’s Drive content in advance, enabling fast and high quality contextual responses.

*   Semantic search across Docs, Slides, Sheets, and more in ChatGPT

*   Supports o4-mini, o3, and GPT-4o

*   Admin scoping by user

Learn more about the [Google Drive synced connector](https://help.openai.com/en/articles/10847137).

## Custom connectors via Model Context Protocol (Beta)

Admins can now build and deploy custom connectors to proprietary systems using Model Context Protocol (MCP).

*   Requires a remote MCP server

*   Available only in deep research

*   Admin-published connectors appear in the connector list for all users

Learn more about [building custom connectors with MCP](http://platform.openai.com/docs/mcp).

## New flexible pricing for ChatGPT Enterprise plans

Flexible pricing for Enterprise plans introduces credit-based access to advanced ChatGPT models and features. Enterprise workspaces purchase a shared credit pool at the contract level. All users in a workspace draw from this pool when using advanced features. There are no individual rate limits. All users retain unlimited access to core ChatGPT models and features.

## May 29, 2025

## Web Composer UI Changes

We’re streamlining the composer. Instead of separate buttons for “Search”, “Deep research”, and more, you’ll now see a single **Tools** dropdown in the lower-left corner.

![Image 1: ChatGPT composer with Tools menu open for image creation, web search, writing or code, and deep research](https://images.ctfassets.net/j22is2dtoxu1/5lfLurlZBnN0Z5XnQr45eY/40ce9051e53e71e3842f14353cf6ef4f/may292025_web_composer.png)

All the same capabilities and tools are still there—just tidier and easier to access in one menu.

## May 22, 2025

## Releasing GPT-4.1 in ChatGPT

Since its launch in the API in April, GPT-4.1 has become a favorite among developers—by popular demand, we’re making it available directly in ChatGPT.

GPT-4.1 is a specialized model that excels at coding tasks. Compared to GPT-4o, it's even stronger at precise instruction following and web development tasks, and offers an alternative to OpenAI o3 and OpenAI o4-mini for simpler, everyday coding needs.

Starting today, Enterprise and Edu users can access GPT-4.1 via the "more models" dropdown in the model picker. GPT-4.1 has the same rate limits as GPT-4o for paid users.

## Introducing GPT-4.1 mini, replacing GPT-4o mini, in ChatGPT

GPT-4.1 mini is a fast, capable, and efficient small model, delivering significant improvements compared to GPT-4o mini—in instruction-following, coding, and overall intelligence. GPT-4.1 mini replaces GPT-4o mini in the model picker under "more models" for paid users, and will serve as the fallback model for free users once they reach their GPT-4o usage limits. Rate limits remain the same.

Evals for GPT-4.1 and GPT-4.1 mini were originally shared in the [blog post](https://openai.com/index/gpt-4-1/) accompanying their API release. They also went through standard safety evaluations. Detailed results are available in the newly launched [Safety Evaluations Hub](https://openai.com/safety/evaluations-hub/).

## May 15, 2025

## Export Deep Research as PDF

You can now export your deep research reports as well-formatted PDFs—complete with tables, images, linked citations, and sources.

To use, click the share icon and select 'Download as PDF.' It works for both new and past reports.

## Mobile UI Composer Consolidation (iOS/Android)

We've removed the row of individual tool icons from the mobile composer and replaces it with the new sliders‑style icon to open the **Skills** menu; tapping that button opens a bottom‑sheet menu where users can choose tools like Create an image or Search the web.

![Image 2: ChatGPT message composer with Ask anything prompt plus, tools, microphone, and voice mode buttons](https://images.ctfassets.net/j22is2dtoxu1/40QIpEtjPhGLqTMBCejijc/aa6c15ae67b99544531be358a8759417/2025-05-15.png)

No tools are deprecated—access is simply consolidated to clear space and reduce on‑screen clutter.

## May 8, 2025

## User Analytics in ChatGPT - GA

The revamped User Analytics dashboard can be accessed in the **Manage workspace** console in the **Analytics tab**. It provides more comprehensive data on usage, adoption, and engagement than the original analytics tab.

This improved dashboard gives Admins a high-level view of how ChatGPT is being used across your organization—use it to track adoption and engagement, understand usage patterns for top tools and GPTs, and identify use cases and user trends.

See [User Analytics for ChatGPT Enterprise and Edu](https://help.openai.com/en/articles/10875114-user-analytics-for-chatgpt-enterprise-and-edu) and [Compliance API vs User Analytics in ChatGPT Enterprise/Edu](https://help.openai.com/en/articles/11327494-compliance-api-vs-user-analytics-in-chatgpt-enterprise-edu).

## May 2, 2025

## 4o Image Generation in GPTs

GPTs can now leverage ChatGPT’s image-generation capabilities to produce images on demand for users.

GPT creators can enable "4o Image Generation" in the Configure section of the GPT editor, under **Capabilities**.

![Image 3: Capabilities list with Web Search, Canvas, and 4o Image Generation enabled, Code Interpreter unchecked](https://images.ctfassets.net/j22is2dtoxu1/670wNgOwRdKAaHf8VI6aWE/ba31f174568be19ebf78a10af4891615/2025-05-02-4oimage.png)

## May 1, 2025

## Deep research

Users that reach their monthly limit (10 tasks/month) with the standard deep research model will now receive 15 additional requests automatically for that month with our lightweight, cost-effective version until the monthly limit resets.

[Learn more about deep research.](https://help.openai.com/en/articles/10500283-deep-research-faq)

## Tasks in o3 and o4-mini

You can now create scheduled tasks that enable ChatGPT to run automated prompts and proactively reach out to you on a scheduled basis with o3 and o4-mini. The “ChatGPT with Schedules Tasks” option in the model selector has been removed.

[Learn more about scheduled tasks in ChatGPT.](https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt)

## April 24, 2025

## o3 and o4-mini

With the introduction of o3 and o4-mini / o4-mini-high, they will supersede o1 and o3-mini / o3-mini-high respectively within ChatGPT.

**OpenAI o3** is our most powerful reasoning model that pushes the frontier across **coding, math, science, visual perception**, and more. It sets a new SOTA on benchmarks including Codeforces, SWE-bench (without building a custom model-specific scaffold), and MMMU. It’s ideal for complex queries requiring multi-faceted analysis and whose answers may not be immediately obvious. It performs especially strongly at visual tasks like analyzing images, charts, and graphics. In evaluations by external experts, o3 makes 20 percent fewer major errors than OpenAI o1 on difficult, real-world tasks—especially excelling in areas like programming, business/consulting, and creative ideation. Early testers highlighted its analytical rigor as a thought partner and emphasized its ability to generate and critically evaluate novel hypotheses—particularly within biology, math, and engineering contexts.

**OpenAI o4-mini** is a smaller model optimized for fast, cost-efficient reasoning—it achieves remarkable performance for its size and cost, particularly in **math, coding, and visual tasks**. It is the best-performing benchmarked model on AIME 2024 and 2025. In expert evaluations, it also outperforms its predecessor, o3‑mini, on non-STEM tasks as well as domains like data science. Thanks to its efficiency, o4-mini supports significantly higher usage limits than o3, making it a strong high-volume, high-throughput option for questions that benefit from reasoning.

## April 10, 2025

## ChatGPT images

Image generation in GPT-4o is now available to all users as the default image generator in ChatGPT. Users who prefer to continue with DALL·E can still access it through the DALL·E GPT.

You can generate images with ChatGPT by simply asking the model to create an image with the details you want, or by selecting the Create image option in the composer. [Learn more](https://help.openai.com/en/articles/8932459-creating-images-in-chatgpt).

## March 31, 2025

## User Analytics in ChatGPT - public beta

The revamped User Analytics dashboard can be accessed in the Manage workspace console in the Analytics tab. It provides more comprehensive data on usage, adoption, and engagement than the original analytics tab.

This improved dashboard gives Admins a high-level view of how ChatGPT is being used across your organization—use it to track adoption and engagement, understand usage patterns for top tools and GPTs, and identify use cases and user trends.

See User Analytics for [ChatGPT Enterprise and Edu (public beta)](https://help.openai.com/en/articles/10875114-user-analytics-for-chatgpt-enterprise-and-edu-public-beta) for details.

## March 20, 2025

## Shared Projects Update

We’re holding off on launching shared projects with View and Edit access so that we can work on a more collaborative version that will be valuable to users.

## March 13, 2025

## Coding with Work with Apps on macOS

When working with IDEs, you can ask ChatGPT to edit open files directly—no copy-pasting required. When you ask for an edit, ChatGPT will generate a diff that you can review and apply, and there’s also an option to automatically apply edits. Diffs are easy to revert in the ChatGPT UI, or by using CMD+Z in your editor.

![Image 4: ChatGPT desktop companion open beside Xcode while editing a Swift SolarSystemDemo file](https://images.ctfassets.net/j22is2dtoxu1/65OOMxu5HjncQxWzWjrRj5/0bdc13b5c7e8a9e43f710aa0da58feb3/2025-03-13.gif)

Enterprise admins can flip the "Work with Apps" toggle off in their Admin Settings to disable this functionality for their workspace members.

## GPT-4.5 in ChatGPT

As of March 13, 2025, users in Enterprise and Edu plans will now be able to use our GPT-4.5 model in ChatGPT!

See GPT-4.5 in ChatGPT for details.

## March 10, 2025

## Deep research in Compliance API ChatGPT

As of March 10th, 2025, for Enterprise customers using the Compliance API your options include:

*   Search for the "deep research global prompt".

*   Look for the tool name in the response look for `{"tool_name":"deep_research"}`.

## February 25, 2025

## Deep research in ChatGPT

In ChatGPT deep research is now available to users on the Enterprise plan.

Deep Research allows ChatGPT to agentically and asynchronously browse the web to complete your professional or personal work.

Enterprise, and Edu users will have 10 deep research queries per month.

See our Deep research FAQ for details.

## February 13, 2025

## o1 pro mode and o3-mini in ChatGPT

In ChatGPT o1 pro mode is now available to Enterprise and o3-mini to Enterprise Edu!

*   **o3-mini:** OpenAI **o3-mini** has replaced o1-mini in the model picker. It’s more cost effective and offers higher rate limits at lower latency. It’s a reasoning model, making it a great choice for coding, STEM, and logical problem-solving tasks. o3-mini shows its chain of thought, and can browse the web.

*   **o1 pro mode**: Also available in the model picker this week is **o1 pro mode**. Designed for accuracy and depth, it excels in research, engineering, business, and law—ideal for professionals tackling highly complex challenges. O1 pro mode will take longer to think through a problem. So responses can take some time. Due to its computational intensity, each user is limited to five queries per month. For most tasks, o1, o3-mini, or GPT-4o will remain optimal choices.

_Re: File Uploads_

*   _Images, docs, and pdfs are supported in the_ _**o1**_ _,_ _**o3-mini**_ _, and_ _**o3-mini-high**_ _models. No spreadsheets (csv/excel)._

*   _Only images are supported in_ _**o1 pro mode**_ _. No docs/pdf and no spreadsheets (csv/excel)._

## Canvas Sharing

ChatGPT Enterprise and Edu users can now share a Canvas asset such as rendered React/HTML code, document, or code with another user, similar to how you share a conversation. You can do this from the Canvas toolbar when Canvas is open.

![Image 5: OpenAI canvas preview with dotted text reading "Sharing now available"](https://images.ctfassets.net/j22is2dtoxu1/3grkJx9AQfn7R06zrXXBOJ/c1234a8d43170d22caefd88d0af3a6e9/2025-02-13.gif)

For more details about the canvas feature in ChatGPT, check out the following Help Center article!

## January 23, 2025

## Projects

Projects are now available for all paid plans including Enterprise and Edu.

See Using projects in ChatGPT for details.

## January 16, 2025

## Visual Retrieval (PDFs) for ChatGPT Enterprise

ChatGPT Enterprise now supports reading and understanding visuals (images, graphs, diagrams, etc.) embedded in PDF files. Users can upload a PDF, and ChatGPT can interpret the text and any visual elements within that file.

For details see Visual Retrieval with PDFs FAQ.

## December 12, 2024

## o1

Starting today, all ChatGPT Enterprise customers will be able to access o1 through the model selector, replacing o1-preview.

o1 can now be used to reason about image uploads, opening up new applications by analyzing and explaining visual representations with more detail and accuracy. We have also trained the model to be more concise in its thinking, resulting in faster response times than o1-preview.

## December 11, 2024

## Apple Intelligence with ChatGPT

ChatGPT admins can now enable and disable access to Apple Intelligence from their workspace admin settings, under Connections.

If this setting is toggled off, users cannot select their ChatGPT Enterprise/Edu workspace when logging in with their OpenAI credentials.

## December 10, 2024

## Canvas

Today we made Canvas available in 4o by default for all users, Free and Paid. Additionally, we launched a number of new capabilities for canvas, including:

*   **Canvas in GPTs**: Canvas can now be used with GPTs when enabled in the GPT creator. This toggle will be enabled for newly created GPTs by default.

*   **Python code execution**: You can now execute Python code in a canvas. ChatGPT will take a pass on fixing bugs in your code and provide comments on errors. Please note that executing Python can make external network requests, and Enterprise workspace admins can disable Python code execution by toggling the **Canvas code execution**setting in their [Admin settings](https://chatgpt.com/admin/settings). This is turned off by default for all Enterprise accounts.

*   **Canvas shortcut:**You can now paste content into ChatGPT and instantly open it in canvas via a shortcut in the upper right corner of the composer.

*   **Canvas in Toolbox:**Canvas has been added as an option in the toolbox.

Workspace admins can now use the Compliance API to get, list, and delete canvas text documents.

Please note that the Admin Setting to disable canvas has been removed, as this feature is now out of beta. If this was previously disabled, we will continue to honor that setting. Please contact support@openai.com if you would like to update this setting for your Enterprise/Edu workspace

## December 3, 2024

## Work with Apps on macOS

ChatGPT can now read content from your coding apps, bringing you smarter, more accurate answers tailored to your work by using Work with Apps on macOS. Learn more about [Work with Apps on macOS](https://help.openai.com/en/articles/10119604-work-with-apps-on-macos).

Enterprise admins can flip the "Work with Apps" toggle off in their Admin Settings to disable this functionality for their workspace members.

## November 22, 2024

## Updates to the ChatGPT Web experience

We are rolling out the following updates over the next two weeks to all ChatGPT users.

### **Sidebar redesign**

*   New floating mode added with soft dismiss behavior

*   Recent conversations are now limited in the sidebar, with an unlimited infinite scroll flyout for all conversations

*   Recent GPTs & Pinned GPT's are now displayed below conversations

*   Settings are now always in the bottom of the sidebar

*   A small settings icon was added in larger viewports when the sidebar is not open

*   New transitions were added to create a more immersive feel

### **Other updates for ChatGPT on Web**

*   The core underpinnings of the site were revamped, offering much better support for a larger variety of devices and sizes

*   Initiating a new conversation now scrolls it into view at the top of the screen

*   Initiating a new conversation no longer auto scrolls to the bottom while the message is generating

*   The sidebar when pinned can now stay open with an active Canvas if enough space is available

*   A new composer bar layout now fades content underneath it as you scroll with an updated look & feel

*   The new chat button has been moved to the left of the Model Picker to be easier to access

*   The system icon in conversations has been removed to make additional horizontal space

*   Dall-E focused view has an updated layout

*   GPT Creator has an updated layout

### **Improved Mobile Web Experience**

*   The experience with the on-screen keyboard on mobile devices has been greatly improved across iOS & Android devices

*   The new sidebar is always in floating mode and auto closes when switching threads

*   We no longer focus the composer on mobile web when switching conversations

*   An issue causing scroll to get stuck in certain situations should be resolved

## November 20, 2024

## Update to GPT-4o

We’ve updated GPT-4o for ChatGPT users on all paid tiers. This update to GPT-4o includes improved writing capabilities that are now more natural, audience-aware, and tailored to improve relevance and readability. This model is also better at working with uploaded files, providing deeper insights and more thorough responses.

## November 19, 2024

## Advanced Voice for ChatGPT Web

Starting today, we’re beginning to roll out Advanced Voice Mode on web (already available on mobile and desktop apps). Users can now start a voice chat on chatgpt.com on their desktop and have real-time, natural conversations with ChatGPT while doing tasks like, planning, writing, and brainstorming.

## November 14, 2024

## Windows App

The improved Windows app is now available through the Microsoft Store for ChatGPT Enterprise and Edu workspaces. ChatGPT users that are familiar with our experience on the web can seamlessly integrate the Windows app into anything they’re doing on their computer.

User access to the ChatGPT Windows app will follow your IT admin’s policies for apps in the Microsoft Store. In the coming weeks, IT admins will also have the option to deploy the app to employee devices via MDM/MAM, rather than allowing direct downloads from the Store.

As with any ChatGPT Enterprise experience, user chat history is secure and will not be used to improve OpenAI's services.

Learn more about the [ChatGPT Windows app](https://help.openai.com/en/articles/9982051-using-the-chatgpt-windows-app).
