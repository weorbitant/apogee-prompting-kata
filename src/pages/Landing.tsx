import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/api/Hero2650.jpg";
import logo from "@/api/Logo-Orbitant.svg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt="Apogee Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <img
              src={logo}
              alt="Orbitant Logo"
              className="h-16 md:h-20 mx-auto filter brightness-0 invert"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Apogee Prompting Kata
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Improve your prompting skills by exploring hidden insights in Apogee data
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-8">
          {/* What's Apogee About */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What's Apogee About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Apogee is the ultimate karma bot for Orbiters. Designed to boost teamwork and reward positive contributions, Apogee lets users award and earn Orbitantmeters — the unique currency for tracking growth and progress.
              </p>
              <p>
                Recognize achievements, encourage collaboration, and foster a positive culture in your Slack workspace with simple commands like <code className="bg-muted px-2 py-1 rounded">@user ++</code> or <code className="bg-muted px-2 py-1 rounded">@user --</code> to add or subtract meters, highlighting each contribution on the team's journey.
              </p>
              <p>
                You can even add your own flavour to the recognitions you make with a personalised message like <code className="bg-muted px-2 py-1 rounded">@user ++ for the amazing help with the blocker I had</code>
              </p>
            </CardContent>
          </Card>

          {/* What's the Kata About */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What's the Kata About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The idea of this kata is to improve our prompting skills by playing around with our own Apogee data. The goal is to come up with a prompt that is capable of surfacing the "hidden gossip" behind our Apogee usage of the last week.
              </p>
            </CardContent>
          </Card>

          {/* What You'll Find */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What You'll Find in This Repo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">A bit of node code</h3>
                <p className="mb-2">
                  A simple node script capable of executing a call to OpenAI to interact with one of their LLM
                </p>
                <p className="mb-2">
                  The script will have access to three different tools (methods):
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code className="bg-muted px-2 py-1 rounded">getLastWeekLeaderboard()</code></li>
                  <li><code className="bg-muted px-2 py-1 rounded">getLastWeekTransactions()</code></li>
                  <li><code className="bg-muted px-2 py-1 rounded">getTodayLeaderboard()</code></li>
                </ul>
                <p className="mt-4 mb-2">
                  The above mentioned tools will give some extra context to your prompt such as:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>the leaderboard as it was 7 days ago</li>
                  <li>the leaderboard as it is right now</li>
                  <li>the list of transactions (messages exchanged to give or take points) of the last 7 days</li>
                </ol>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Example Data</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Leaderboard</h4>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`[
  {
    "name": "David Yusta",
    "total": 190,
    "rank": 1
  },
  {
    "name": "Iván Esteban",
    "total": 138,
    "rank": 2
  },
  {
    "name": "Víctor Pérez del Postigo",
    "total": 115,
    "rank": 3
  },
  {
    "name": "Lucas Jin",
    "total": 111,
    "rank": 4
  },
  {
    "name": "Kevin Martínez",
    "total": 106,
    "rank": 5
  }
]`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Transactions</h4>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`[
  {
    "message": "<@U0961UA5VT7> ++ progressing.... XXYYZZ",
    "amount": 1,
    "timestamp": "2025-11-21T13:34:29.280+00:00",
    "newTotal": 191,
    "fromName": "Víctor Pérez del Postigo",
    "toName": "David Yusta"
  },
  {
    "message": "<@U096TR7NXHU> +++ <@U09LMQM2SQ2> +++ Funcionando a la perfección!",
    "amount": 2,
    "timestamp": "2025-11-21T12:23:13.662+00:00",
    "newTotal": 138,
    "fromName": "Víctor Pérez del Postigo",
    "toName": "Iván Esteban"
  }
]`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>N.B.</strong> the tools in the code will give back some dummy data avoiding to hit our Apogee DB directly during the Kata
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex justify-center pt-4">
            <Link to="/chat">
              <Button size="lg" className="text-lg px-8 py-6">
                Start the Kata
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

