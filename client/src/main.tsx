import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import { ProgressProvider } from './context/ProgressContext';
const HomePage=lazy(()=>import('./pages/HomePage'));const JourneyPage=lazy(()=>import('./pages/JourneyPage'));const TimelinePage=lazy(()=>import('./pages/TimelinePage'));const ArchitecturePage=lazy(()=>import('./pages/ArchitecturePage'));const MuseumPage=lazy(()=>import('./pages/MuseumPage'));const QuizPage=lazy(()=>import('./pages/QuizPage'));const PassportPage=lazy(()=>import('./pages/PassportPage'));const ReflectionsPage=lazy(()=>import('./pages/ReflectionsPage'));const SourcesPage=lazy(()=>import('./pages/SourcesPage'));const NotFoundPage=lazy(()=>import('./pages/NotFoundPage'));
import './styles.css';

const router=createBrowserRouter([{path:'/',element:<Layout/>,children:[{index:true,element:<HomePage/>},{path:'journey',element:<JourneyPage/>},{path:'timeline',element:<TimelinePage/>},{path:'architecture',element:<ArchitecturePage/>},{path:'museum',element:<MuseumPage/>},{path:'quiz',element:<QuizPage/>},{path:'passport',element:<PassportPage/>},{path:'reflections',element:<ReflectionsPage/>},{path:'sources',element:<SourcesPage/>},{path:'*',element:<NotFoundPage/>}]}]);
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ProgressProvider><Suspense fallback={<div className="page-state">Đang mở hành trình…</div>}><RouterProvider router={router}/></Suspense></ProgressProvider></React.StrictMode>);
