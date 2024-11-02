import React, { useState } from 'react';
import { Map, Navigation, Award, Compass, Shield, Landmark, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import picturehome from "./picturehome.jpg";
import './Homepage.css';

const Homepage = () => {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                <img src={logo} alt="Logo" id='homepage-logo'/>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Descoperă Bucureștiul într-un mod nou și captivant
                </h1>
                <p className="text-xl text-blue-100">
                  Explorează orașul, colectează insigne și câștigă recompense în timp ce descoperi locuri fascinante.
                </p>
                <div className="flex gap-4">
                  <button 
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                    onClick={() => navigate('/login')}
                  >
                    Începe Aventura
                  </button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="relative w-full h-64 md:h-96">
                  <img 
                    src={picturehome}
                    alt="City Explorer App Preview" 
                    className="rounded-lg shadow-2xl"
                    id="picturehome"
                  />
                  {/* Floating Achievement Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Award className="text-yellow-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Nou! Ai deblocat</p>
                        <p className="text-gray-900 font-medium">Explorator Cultural</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cum funcționează?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Compass />}
              title="Explorează Orașul"
              description="Descoperă locuri noi și fascinante în București folosind harta interactivă și sugestiile personalizate."
            />
            <FeatureCard 
              icon={<Award />}
              title="Colectează Insigne"
              description="Câștigă insigne unice pentru fiecare realizare și construiește-ți propria colecție de trofee digitale."
            />
            <FeatureCard 
              icon={<Landmark />}
              title="Primește Recompense"
              description="Acumulează puncte și deblochează oferte speciale la atracții turistice și localuri partenere."
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="50+" text="Locații Unice" />
            <StatCard number="1000+" text="Utilizatori Activi" />
            <StatCard number="30+" text="Parteneri Locali" />
            <StatCard number="500+" text="Insigne Deblocate" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pași simpli pentru a începe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard 
              number="1"
              icon={<Users />}
              title="Creează cont"
              description="Înregistrează-te gratuit în aplicație"
            />
            <StepCard 
              number="2"
              icon={<Map />}
              title="Explorează harta"
              description="Găsește locații interesante în apropiere"
            />
            <StepCard 
              number="3"
              icon={<Navigation />}
              title="Vizitează locații"
              description="Mergi la locații și introdu codul unic"
            />
            <StepCard 
              number="4"
              icon={<Award />}
              title="Primește recompense"
              description="Deblochează insigne și câștigă puncte"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ce spun exploratorii noștri</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              text="Am descoperit locuri incredibile în București pe care nu le știam, deși locuiesc aici de ani de zile!"
              author="Maria P."
              role="Local Explorer"
            />
            <TestimonialCard 
              text="Perfect pentru turiști! Am vizitat toate obiectivele importante și am primit și recompense pentru asta."
              author="John D."
              role="Tourist"
            />
            <TestimonialCard 
              text="Copiii mei adoră să colecteze insigne și să descopere orașul ca într-o vânătoare de comori."
              author="Alexandru M."
              role="Family Explorer"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Gata să începi aventura?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Alătură-te comunității noastre de exploratori și descoperă Bucureștiul într-un mod nou și interactiv.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition" onClick={() => navigate('/login')}>
            Începe să Explorezi
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center">
    <div className="inline-block p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ number, text }) => (
  <div className="p-6">
    <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-gray-600">{text}</div>
  </div>
);

const StepCard = ({ number, icon, title, description }) => (
  <div className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
    <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const TestimonialCard = ({ text, author, role }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
    <div className="text-gray-600 mb-4 italic">"{text}"</div>
    <div>
      <div className="font-semibold">{author}</div>
      <div className="text-sm text-gray-500">{role}</div>
    </div>
  </div>
);

export default Homepage;