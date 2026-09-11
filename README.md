# Pilot: TV Show Tracker and Episode Rating Website

📺 A full-stack website where users can search for TV shows, rate individual episodes and seasons, manage a watchlist and view their watching history.

<p align="center">
  <img src="https://github.com/user-attachments/assets/da4c72fe-7690-42c4-a3a4-1508cabe91eb" width="900" alt="Pilot home page" />
</p>

## Overview

*Technologies: Next.js, React, JavaScript, SQLite, Lucia Auth, Tailwind CSS and the TMDB API*

Pilot gets its TV data from TMDB. Users can create an account, search for shows and open a page containing the show's seasons, episodes, cast and similar programmes.

Episode ratings, season reviews and watchlist entries are stored in SQLite. This data is linked to the user's account and displayed on their profile.

## What It Can Do

### Find TV shows

The home page displays popular TV shows from TMDB. Each card links to a full show page containing its description, release year, genres and number of seasons.

The search bar returns results while the user types. Selecting a result opens that show's page, while pressing Enter displays a full page of matching shows.

<p align="center">
  <img src="https://github.com/user-attachments/assets/4d8dfb1d-e8ec-4005-a367-6c6857894462" width="900" alt="Pilot live TV show search" />
</p>

<p align="center">
  <sub>Search results update as the user types.</sub>
</p>

### View seasons and episodes

Each show page is divided into Episodes, Overview, Cast and Similar Shows.

The Episodes tab contains a button for every season. Selecting a season loads its episode list, including episode names, descriptions, images and air dates.

<p align="center">
  <img src="https://github.com/user-attachments/assets/4d61b55c-42da-4407-8688-802c696e5b47" width="900" alt="Pilot show page and episode list" />
</p>

<p align="center">
  <sub>Each season has its own episode list.</sub>
</p>

### Rate and review episodes

Selecting an episode opens a rating window. The user can give the episode between one and five stars and add an optional written review.

A user can return to a rated episode and change the score or review. The existing database entry is updated instead of creating a second rating for the same episode.

Once an episode has been rated, it is counted as watched and appears on the user's profile.

<p align="center">
  <img src="https://github.com/user-attachments/assets/7ef50fb3-cfd8-4464-ace1-5fd999ef001e" width="900" alt="Pilot episode rating and review window" />
</p>

<p align="center">
  <sub>Episodes can be rated from one to five stars with an optional review.</sub>
</pp>

### Rate complete seasons

Pilot calculates a season rating from the episodes the user has rated. The result is displayed above the episode list.

Users can also write a separate review for the complete season. Episode reviews and season reviews are stored separately.


### Manage a watchlist

A show can be added to or removed from the user's watchlist from its main page.

The database stores the TMDB ID of each selected show. When the watchlist is opened, Pilot uses those IDs to fetch the current show names, posters and other information from TMDB.


### View profiles and ratings

Each profile displays the user's watched shows, watchlist, ratings and watching totals.

Users can also view another person's profile and open one of their rated shows. Pilot displays that person's episode rating and review, with the current user's own rating shown underneath when available.

<p align="center">
  <img src="https://github.com/user-attachments/assets/ea77866d-74c6-4104-9c48-f96cd28cc65a" width="900" alt="Pilot user profile and watching history" />
</p>

<p align="center">
  <sub>Profiles contain watched shows, watchlists and previous ratings.</sub>
</p>

### Create and access an account

Pilot includes registration, login and logout. Passwords are hashed before they are stored, while Lucia Auth creates and validates the user's session.

The SQLite database keeps each user's ratings, reviews, statistics and watchlist entries separate.
