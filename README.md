# Denied List for LinkedIn

A Chrome extension that hides LinkedIn job cards you do not want to see. Add a company, a phrase such as `applied`, or any other word, and matching cards disappear from the search results.

## Why this exists

LinkedIn search results fill up with jobs that are not a fit: listings syndicated from other job boards, companies you already ruled out, and roles you already applied to. A page of 25 jobs can leave only a handful worth opening, and the rest still sit there with an "Applied" or "Candidatura enviada" label.

This extension removes those cards for you. One denied list covers companies, already-applied jobs, and any other unwanted text.

## Features

- **Denied list.** Add, edit, or delete terms from the popup. Each term is one word or a phrase.
- **Whole card.** A card is hidden when the term appears anywhere in its text, not only in the company name.
- **Whole word or phrase.** Matching ignores case. `Google` hides `Google LLC`. `java` does not hide `javascript`. `candidatura enviada` hides that phrase.
- **Extension switch.** **Extensão ativa** turns filtering on or off. Turning it off, or deleting a term, brings the cards back without a reload.

## How it works

1. Open the popup and keep **Extensão ativa** on.
2. Press **Nova** and save a term, or edit and delete terms already in the list.
3. On a LinkedIn job search, the extension reads the text of each job card and hides the card when any term matches as a whole word or phrase.
4. The match uses the card's own text, so a hidden card stays hidden when LinkedIn re-renders the list.

Examples you can add:

| Term | What it hides |
| --- | --- |
| `Acme` | Cards that mention Acme as a whole word |
| `applied` | Jobs you already applied to, in English |
| `candidatura enviada` | Jobs you already applied to, in Portuguese |

## Install

### From a release

1. Download the latest build ZIP from the [releases](https://github.com/yuripinheirot/denied-list-for-linkedin/releases) page and unzip it.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select the unzipped folder.
5. Pin the extension, then refresh the LinkedIn jobs page.

### From source

1. Install dependencies with `yarn`.
2. Build with `yarn build`.
3. Open `chrome://extensions`, turn on **Developer mode**, and load the unpacked `build` folder.
4. Pin the extension, then refresh the LinkedIn jobs page.

## Usage

1. Search for jobs on LinkedIn.
2. Open the extension popup.
3. Add the companies, statuses, or phrases you do not want to see.
4. Matching cards disappear from the list. Remove a term, or turn **Extensão ativa** off, to see them again.

## Tech stack

- [Chrome Extensions](https://developer.chrome.com/docs/extensions/mv3/), Manifest V3
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)

## Contributing

Contributions are welcome. Open a pull request or an issue if you have an idea or a suggestion.

## License

This project is licensed under the MIT License.
