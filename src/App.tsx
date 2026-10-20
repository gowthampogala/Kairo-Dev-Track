import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { TopBar } from './components/common/TopBar';
import { OverviewView } from './components/overview/OverviewView';
import { DailyChecklistView } from './components/daily/DailyChecklistView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { ProjectsView } from './components/projects/ProjectsView';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { WeeklyReviewsView } from './components/reviews/WeeklyReviewsView';
import { SettingsView } from './components/settings/SettingsView';
import { JSRoadmapView } from './components/roadmap/JSRoadmapView';
import { SpringFrameworkRoadmapView } from './components/roadmap/SpringFrameworkRoadmapView';
import { AIEngineeringRoadmapView } from './components/roadmap/AIEngineeringRoadmapView';
import { NetworkFundamentalsRoadmapView } from './components/roadmap/NetworkFundamentalsRoadmapView';
import { PasteToProjectModal } from './components/importer/PasteToProjectModal';

export const App: React.FC = () => {
  const { activePage } = useApp();

  const renderCurrentView = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewView />;
      case 'daily':
        return <DailyChecklistView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'js-roadmap':
        return <JSRoadmapView />;
      case 'spring-framework':
      case 'spring-boot-roadmap':
        return <SpringFrameworkRoadmapView />;
      case 'ai-roadmap':
      case 'ai-engineering':
        return <AIEngineeringRoadmapView />;
      case 'network-roadmap':
      case 'network-fundamentals':
        return <NetworkFundamentalsRoadmapView />;
      case 'projects':
        return <ProjectsView />;
      case 'workspace':
        return <WorkspaceView />;
      case 'reviews':
        return <WeeklyReviewsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="app-container">
      <TopBar />
      <Sidebar />
      <main className="app-main">
        {renderCurrentView()}
      </main>
      <PasteToProjectModal />
    </div>
  );
};

export default App;
