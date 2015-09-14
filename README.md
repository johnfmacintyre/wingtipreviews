# wingtiptickets-reviews

DocumentDB demo application.

## Setup

### Download the source code.

```
git clone git@github.com/aliuy/wingtiptickets-reviews
cd wingtiptickets-reviews
npm install
```

### Environment variables

Set up the following environment variables (e.g. `/etc/environment`, `/.vscode/launch.json`, etc.)

```
DOCDB_HOST="[YOUR_DOCDB_ENDPOINT_HERE]"
DOCDB_AUTH_KEY="[YOUR_DOCDB_KEY_HERE]"
DOCDB_DATABASE="wingtipreviews"
DOCDB_COLLECTION="reviews"
```

## Start

```
npm start
```
