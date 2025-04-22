# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b109d350-b900-4fd5-927c-812b10e95e26

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b109d350-b900-4fd5-927c-812b10e95e26) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b109d350-b900-4fd5-927c-812b10e95e26) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Client-side Routing Configuration

Since this is a Single Page Application (SPA) using React Router, you need proper server configuration to handle direct URL access to routes like `/post/your-post-id`.

This repository includes configuration files for different hosting platforms:

- **Netlify**: Uses `_redirects` file and `netlify.toml` to configure routing
- **Vercel**: Uses `vercel.json` to handle client-side routes
- **Apache**: Uses `.htaccess` file with URL rewriting rules

When deploying your application, make sure these files are properly included in your build and the server is configured to handle all routes by serving the main `index.html` file.

Without this configuration, direct access to URLs like `https://blog420.site/post/043af443-ad7b-42c9-94a6-8506413a8847` will result in a 404 error, as the server will try to find a file that doesn't exist instead of letting the client-side router handle it.
