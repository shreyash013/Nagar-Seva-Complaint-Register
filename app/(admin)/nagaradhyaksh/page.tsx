import { ShieldAlert, Plus, LayoutDashboard, ListTodo, Map, BarChart3, FileText, Settings, HelpCircle, Bell, UserCircle, Calendar, Filter, AlertTriangle, CheckCircle2, Percent, Clock, Droplet, Trash2, Lightbulb, Route } from "lucide-react";

export default function NagaradhyakshDashboard() {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto pb-32 md:pb-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-lg gap-4 pt-4 md:pt-0">
            <div>
              <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">Command Center</h1>
              <p className="text-on-surface-variant font-sans text-body-md mt-1">Nagaradhyaksh Executive Dashboard</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-48">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <select className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg font-sans text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary appearance-none font-medium">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                </select>
              </div>
              <button className="bg-surface border border-outline-variant rounded-lg p-2 text-on-surface hover:bg-surface-container-low transition-colors flex-shrink-0">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Key Metrics Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter mb-stack-lg">
            <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-sans text-label-md text-on-surface-variant font-medium">Total Complaints</span>
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">1,248</div>
                <div className="flex items-center text-secondary font-sans text-label-sm mt-1 font-semibold">
                  <span>↑ 12% from last mo</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-sans text-label-md text-on-surface-variant font-medium">Resolved</span>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">982</div>
                <div className="flex items-center text-green-700 font-sans text-label-sm mt-1 font-semibold">
                  <span>↑ 8% from last mo</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-sans text-label-md text-on-surface-variant font-medium">Resolution Rate</span>
                <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">78.6%</div>
                <div className="flex items-center text-error font-sans text-label-sm mt-1 font-semibold">
                  <span>↓ 2% from last mo</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-sans text-label-md text-on-surface-variant font-medium">Avg. Time</span>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">4.2<span className="text-[18px] text-on-surface-variant ml-1 font-sans font-normal">days</span></div>
                <div className="flex items-center text-green-700 font-sans text-label-sm mt-1 font-semibold">
                  <span>↓ 0.5 days from last mo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
            {/* Ward Heatmap Proxy */}
            <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-title-md text-on-surface font-semibold">Ward-wise Volume</h3>
                <button className="text-primary font-sans text-label-md hover:underline font-semibold">View Map</button>
              </div>
              <div className="flex-1 min-h-[300px] bg-surface-container-low rounded-lg flex items-end justify-around p-4 gap-2 border border-outline-variant/50">
                {[
                  { label: "W1", height: "85%", color: "bg-error-container/80", hover: "hover:bg-error-container" },
                  { label: "W2", height: "40%", color: "bg-primary-container/30", hover: "hover:bg-primary-container/40" },
                  { label: "W3", height: "65%", color: "bg-primary-container/60", hover: "hover:bg-primary-container/70" },
                  { label: "W4", height: "25%", color: "bg-primary-container/20", hover: "hover:bg-primary-container/30" },
                  { label: "W5", height: "70%", color: "bg-orange-200", hover: "hover:bg-orange-300" },
                  { label: "W6", height: "45%", color: "bg-primary-container/40", hover: "hover:bg-primary-container/50" },
                  { label: "W7", height: "15%", color: "bg-primary-container/10", hover: "hover:bg-primary-container/20" },
                ].map((bar) => (
                  <div key={bar.label} className="w-full flex flex-col items-center gap-2 group">
                    <div className={`w-full ${bar.color} rounded-t-sm transition-all duration-300 ${bar.hover}`} style={{ height: bar.height }}></div>
                    <span className="font-sans text-label-sm text-on-surface-variant truncate font-medium">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Trends */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
              <h3 className="font-heading text-title-md text-on-surface mb-6 font-semibold">Category Trends</h3>
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="text-secondary w-5 h-5" />
                      <span className="font-sans text-label-md text-on-surface font-medium">Water Supply</span>
                    </div>
                    <span className="font-sans text-label-sm text-error flex items-center font-semibold">↑ 42%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Trash2 className="text-orange-700 w-5 h-5" />
                      <span className="font-sans text-label-md text-on-surface font-medium">Solid Waste</span>
                    </div>
                    <span className="font-sans text-label-sm text-green-700 flex items-center font-semibold">↓ 12%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="text-primary w-5 h-5" />
                      <span className="font-sans text-label-md text-on-surface font-medium">Street Lights</span>
                    </div>
                    <span className="font-sans text-label-sm text-on-surface-variant flex items-center font-semibold">→ 2%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Route className="text-outline w-5 h-5" />
                      <span className="font-sans text-label-md text-on-surface font-medium">Roads</span>
                    </div>
                    <span className="font-sans text-label-sm text-error flex items-center font-semibold">↑ 18%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div className="bg-outline h-2 rounded-full" style={{ width: "55%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent High Priority */}
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-heading text-title-md text-on-surface font-semibold">High Priority Escalations</h3>
              <button className="text-primary font-sans text-label-md hover:underline font-semibold">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant font-sans text-label-sm text-on-surface-variant">
                    <th className="py-3 px-6 font-medium">ID</th>
                    <th className="py-3 px-6 font-medium">Category</th>
                    <th className="py-3 px-6 font-medium">Ward</th>
                    <th className="py-3 px-6 font-medium">Status</th>
                    <th className="py-3 px-6 font-medium">Days Open</th>
                    <th className="py-3 px-6 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-sans text-body-md text-on-surface">
                  <tr className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4 px-6 font-sans text-label-md font-medium">#CMP-8492</td>
                    <td className="py-4 px-6">Major Pipeline Burst</td>
                    <td className="py-4 px-6">Ward 1</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-sans text-label-sm font-semibold">Critical</span>
                    </td>
                    <td className="py-4 px-6 text-error font-medium">4 Days</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-primary hover:text-primary-container font-sans text-label-md font-semibold">Intervene</button>
                    </td>
                  </tr>
                  <tr className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4 px-6 font-sans text-label-md font-medium">#CMP-8501</td>
                    <td className="py-4 px-6">Garbage Dump Overflow</td>
                    <td className="py-4 px-6">Ward 5</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-sans text-label-sm font-semibold">High</span>
                    </td>
                    <td className="py-4 px-6">3 Days</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-primary hover:text-primary-container font-sans text-label-md font-semibold">Intervene</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4 px-6 font-sans text-label-md font-medium">#CMP-8512</td>
                    <td className="py-4 px-6">Transformer Failure</td>
                    <td className="py-4 px-6">Ward 2</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-sans text-label-sm font-semibold">High</span>
                    </td>
                    <td className="py-4 px-6">2 Days</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-primary hover:text-primary-container font-sans text-label-md font-semibold">Intervene</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
  );
}
