# MangaluruBus

[Live site](https://mangaluru-bus.in/)

Search for your bus in Mangalore City

## Installation

### Requirements

- PHP ^8.2
- Composer
- Laravel ^11.31

See https://laravel.com/docs/11.x/installation#installing-php for instructions on installing PHP, Composer, and Laravel.

### Setup

```bash
# create a directory for the project and open bash in that directory
git clone https://github.com/Rod911/mangaluru-bus.git .

# Install PHP dependencies using Composer:
composer install

# Create your environment file:
cp .env.example .env

# Generate an application key:
php artisan key:generate

# Configure your .env file with your local database settings

# Run database migrations
php artisan migrate

# Install frontend dependencies
npm install

# Start the local development server
composer run dev
```

## Development

### Shadcn UI
The application uses [Shadcn UI](https://ui.shadcn.com/). It's a collection of ready-to-use components, utilities, and templates for building modern and accessible user interfaces.

To add new components, use the `npx shadcn@latest add <component-name>` command. The components will be added in the [resources/js/Components/ui](resources/js/Components/ui) directory.

You will have to update the imports to match the directories like so:
```tsx
import { cn } from "resources/lib/utils"
import { <component-name> } from "resources/js/Components/ui/<component-name>"
```
To
```tsx
import { cn } from "@/lib/utils";
import { <component-name> } from "@/Components/ui/<component-name>";
```

### Typescript
To list all typescript errors, run `npm run typecheck`
