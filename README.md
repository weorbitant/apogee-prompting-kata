# apogee-prompting-kata

## What's apogee about

Apogee is the ultimate karma bot for Orbiters. Designed to boost teamwork and reward positive contributions, Apogee lets users award and earn Orbitantmeters — the unique currency for tracking growth and progress.
Recognize achievements, encourage collaboration, and foster a positive culture in your Slack workspace with simple commands like `@user ++` or `@user --` to add or subtract meters, highlighting each contribution on the team’s journey.
You can even add your own flavour to the recognitions you make with a personalised message like `@user ++ for the amazing help with the blocker I had`

## What's the kata about

The idea of this kata is to improve our prompting skills by playing around with our own Apogee data. The goal is to come up with a prompt that is capable of surfacing the "hidden gossip" behind our Apogee usage of the last week.

## What you'll find in this repo

### A bit of node code

A simple node script capable of executing a call to OpenAI to interact with one of their LLM

The script will have access to three different tools (methods)

- `getLastWeekLeaderboard()`
- `getLasteWeekTransactions()`
- `getTodayLeaderboard()`

The above mentioned tools will give some extra context to your prompt such as

1. the leaderboard as it was 7 days ago
2. the leaderboard as it is right now
3. the list of transactions (messages exchanged to give or take points) of the last 7 days

To give you a quick understanding of the data would look like here is an example of them

**Leaderboard**

// TODO --> add example of data

**Transactions**

// TODO --> add example of data

N.B. the tools in the code will give back some dummy data avoding to hit our Apogee DB directly during the Kata

### A prompt file

An empty file ready to be filled in with your own magical prompt.
Knowing that the above tools will give your prompt access to an interesting data context is up to you to extract the hidden info from there with a well crafted prompt.
Here is an example of a not so well crafted one, just to give you some sense of what can be done

```
Tell me the top 5 users in the leaderboard as of now and if there is anyone that was not there a week ago
```

### A way to test you prompt

In order to craft and test your prompt iteratively you'll have to

1. Install the project dependencies with `npm i`
2. Create a `.env` file to store the OpenAI key
3. Run the node script as many time as you want with `npm run`

## What's in there for you

Eternal glory, the winning prompt will become part of Apogee to be ran weekly on our bot. You have a set of interesting raw data at hand, the limit is your imagination.

## Useful bits

If you are new to prompting here is a 8 min amazing video that may be helpful [Master the Perfect ChatGPT Prompt Formula](https://www.youtube.com/watch?v=jC4v5AS4RIM)
