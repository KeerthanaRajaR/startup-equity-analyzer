import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, DollarSign, Calculator, Save, AlertCircle, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Founder {
  id: string;
  name: string;
  equity: number;
  investment: number;
  role: string;
}

interface FundingRound {
  id: string;
  round_name: string;
  investment: number;
  valuation: number;
  date: string;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const EquityDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [founders, setFounders] = useState<Founder[]>([
    { id: "1", name: "Alice Johnson", equity: 60, investment: 50000, role: "CEO" },
    { id: "2", name: "Bob Smith", equity: 40, investment: 30000, role: "CTO" },
  ]);

  const [newFounder, setNewFounder] = useState({
    name: "",
    equity: 0,
    investment: 0,
    role: ""
  });

  const [companyValuation, setCompanyValuation] = useState(1000000);
  const [totalFunding, setTotalFunding] = useState(100000);

  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([
    { id: "1", round_name: "Seed", investment: 500000, valuation: 2000000, date: "2024-01-15" },
    { id: "2", round_name: "Series A", investment: 2000000, valuation: 10000000, date: "2024-06-20" },
  ]);

  const [newRound, setNewRound] = useState({
    round_name: "",
    investment: 0,
    valuation: 0,
    date: ""
  });

  const handleSaveChanges = () => {
    // Validation
    const totalEquity = founders.reduce((sum, founder) => sum + founder.equity, 0);
    if (totalEquity !== 100) {
      toast({
        title: "Invalid Equity Distribution",
        description: `Total equity must equal 100%. Current total: ${totalEquity}%`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Changes Saved Successfully",
      description: "All equity data has been updated.",
    });
  };

  const handleAddFounder = () => {
    if (!newFounder.name || !newFounder.role || newFounder.equity <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newId = (founders.length + 1).toString();
    setFounders([...founders, { ...newFounder, id: newId }]);
    setNewFounder({ name: "", equity: 0, investment: 0, role: "" });
    
    toast({
      title: "Founder Added",
      description: `${newFounder.name} has been added to the cap table.`,
    });
  };

  const updateFounderEquity = (id: string, equity: number) => {
    setFounders(founders.map(founder => 
      founder.id === id ? { ...founder, equity } : founder
    ));
  };

  const pieData = founders.map((founder, index) => ({
    name: founder.name,
    value: founder.equity,
    color: COLORS[index % COLORS.length]
  }));

  const founderValues = founders.map(founder => ({
    name: founder.name,
    value: (companyValuation * founder.equity) / 100,
    equity: founder.equity
  }));

  const totalEquity = founders.reduce((sum, founder) => sum + founder.equity, 0);
  const remainingEquity = 100 - totalEquity;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Startup Founder Equity Analyzer
            </h1>
            <p className="text-muted-foreground mt-2">
              Analyze and manage founder equity distribution and vesting schedules
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSaveChanges} className="bg-gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Company Valuation</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${companyValuation.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current market value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Founders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{founders.length}</div>
              <p className="text-xs text-muted-foreground">Active founders</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equity Distributed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquity}%</div>
              <p className="text-xs text-muted-foreground">
                {remainingEquity > 0 ? `${remainingEquity}% remaining` : "Fully allocated"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${founders.reduce((sum, f) => sum + f.investment, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Founder investments</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="funding">Funding Rounds</TabsTrigger>
            <TabsTrigger value="exit">Exit Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Equity Distribution Chart */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Equity Distribution</CardTitle>
                  <CardDescription>Current founder equity breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Founder Details */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Founder Details</CardTitle>
                  <CardDescription>Manage individual founder information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {founders.map((founder) => (
                    <div key={founder.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold">{founder.name}</div>
                        <div className="text-sm text-muted-foreground">{founder.role}</div>
                        <Badge variant="secondary">${founder.investment.toLocaleString()} invested</Badge>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={founder.equity}
                            onChange={(e) => updateFounderEquity(founder.id, Number(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                        <div className="text-sm font-medium">
                          ${((companyValuation * founder.equity) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Add New Founder */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Add New Founder</CardTitle>
                <CardDescription>Expand your founding team</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newFounder.name}
                    onChange={(e) => setNewFounder({ ...newFounder, name: e.target.value })}
                    placeholder="Founder name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={newFounder.role}
                    onChange={(e) => setNewFounder({ ...newFounder, role: e.target.value })}
                    placeholder="e.g., CEO, CTO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equity">Equity %</Label>
                  <Input
                    id="equity"
                    type="number"
                    value={newFounder.equity}
                    onChange={(e) => setNewFounder({ ...newFounder, equity: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investment">Investment</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={newFounder.investment}
                    onChange={(e) => setNewFounder({ ...newFounder, investment: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddFounder} className="w-full">
                    Add Founder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Founder Value Analysis</CardTitle>
                  <CardDescription>Equity value by founder</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={founderValues}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                      />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Equity vs Investment</CardTitle>
                  <CardDescription>Compare equity percentage to investment amount</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {founders.map((founder, index) => {
                    const roiMultiplier = (companyValuation * founder.equity / 100) / founder.investment;
                    return (
                      <div key={founder.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{founder.name}</span>
                          <Badge variant={roiMultiplier > 5 ? "default" : roiMultiplier > 2 ? "secondary" : "destructive"}>
                            {roiMultiplier.toFixed(1)}x ROI
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Investment: ${founder.investment.toLocaleString()}</div>
                          <div>Current Value: ${((companyValuation * founder.equity) / 100).toLocaleString()}</div>
                        </div>
                        <Progress value={founder.equity} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {remainingEquity !== 0 && (
              <Card className="shadow-medium border-warning">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Equity Allocation Warning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-warning-foreground">
                    {remainingEquity > 0 
                      ? `${remainingEquity}% equity remains unallocated. Consider reserving for employee stock option pool or future founders.`
                      : `Equity is over-allocated by ${Math.abs(remainingEquity)}%. Please adjust founder percentages.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="funding" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Funding Timeline</CardTitle>
                  <CardDescription>Investment rounds over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fundingRounds}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="round_name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Investment']}
                      />
                      <Bar dataKey="investment" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Valuation Progression</CardTitle>
                  <CardDescription>Company valuation growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={fundingRounds}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="round_name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Valuation']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="valuation" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Funding Rounds List */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Funding Rounds</CardTitle>
                <CardDescription>Manage investment rounds and valuations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fundingRounds.map((round) => (
                  <div key={round.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-semibold">{round.round_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(round.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-medium">
                        ${round.investment.toLocaleString()} raised
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${round.valuation.toLocaleString()} valuation
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Add New Round */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Add Funding Round</CardTitle>
                <CardDescription>Record a new investment round</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="round_name">Round Name</Label>
                  <Input
                    id="round_name"
                    value={newRound.round_name}
                    onChange={(e) => setNewRound({ ...newRound, round_name: e.target.value })}
                    placeholder="e.g., Seed, Series A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investment">Investment Amount</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={newRound.investment}
                    onChange={(e) => setNewRound({ ...newRound, investment: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valuation">Post-Money Valuation</Label>
                  <Input
                    id="valuation"
                    type="number"
                    value={newRound.valuation}
                    onChange={(e) => setNewRound({ ...newRound, valuation: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newRound.date}
                    onChange={(e) => setNewRound({ ...newRound, date: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      if (!newRound.round_name || !newRound.investment || !newRound.valuation || !newRound.date) {
                        toast({
                          title: "Invalid Input",
                          description: "Please fill in all required fields.",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      const newId = (fundingRounds.length + 1).toString();
                      setFundingRounds([...fundingRounds, { ...newRound, id: newId }]);
                      setNewRound({ round_name: "", investment: 0, valuation: 0, date: "" });
                      
                      toast({
                        title: "Funding Round Added",
                        description: `${newRound.round_name} round has been recorded.`,
                      });
                    }}
                    className="w-full"
                  >
                    Add Round
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exit" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Exit Scenario Analysis</CardTitle>
                  <CardDescription>Potential returns at different valuations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[2, 5, 10, 20].map((multiplier) => {
                    const exitValuation = companyValuation * multiplier;
                    return (
                      <div key={multiplier} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{multiplier}x Exit (${(exitValuation / 1000000).toFixed(1)}M)</span>
                          <Badge variant={multiplier >= 10 ? "default" : "secondary"}>
                            {multiplier >= 10 ? "High Return" : "Moderate Return"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {founders.map((founder) => (
                            <div key={founder.id} className="text-center p-2 bg-muted rounded">
                              <div className="font-medium">{founder.name}</div>
                              <div>${((exitValuation * founder.equity) / 100 / 1000000).toFixed(1)}M</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Dilution Impact</CardTitle>
                  <CardDescription>How future funding rounds affect ownership</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[10, 20, 30].map((dilution) => (
                    <div key={dilution} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dilution}% Dilution</span>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {founders.map((founder) => {
                          const newEquity = founder.equity * (1 - dilution / 100);
                          return (
                            <div key={founder.id} className="text-center p-2 bg-muted rounded">
                              <div className="font-medium">{founder.name}</div>
                              <div>{newEquity.toFixed(1)}%</div>
                              <div className="text-xs text-muted-foreground">
                                ({founder.equity}% → {newEquity.toFixed(1)}%)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Company Valuation Settings</CardTitle>
                <CardDescription>Adjust current company valuation for analysis</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="valuation">Company Valuation ($)</Label>
                  <Input
                    id="valuation"
                    type="number"
                    value={companyValuation}
                    onChange={(e) => setCompanyValuation(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funding">Total Funding Raised ($)</Label>
                  <Input
                    id="funding"
                    type="number"
                    value={totalFunding}
                    onChange={(e) => setTotalFunding(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};