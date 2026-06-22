import React from 'react';
import { X } from 'lucide-react';

const BOARD_PROPERTIES = [
  { name: "DSM", color: "brown", price: 60, rent: 2 },
  { name: "DOD", color: "brown", price: 90, rent: 4 },
  { name: "Deltech", color: "lightblue", price: 120, rent: 6 },
  { name: "The HIMS Cafe", color: "lightblue", price: 130, rent: 6 },
  { name: "Raj Soin", color: "lightblue", price: 150, rent: 8 },
  { name: "Boys Hostel Complex", color: "pink", price: 140, rent: 10 },
  { name: "Type II & ABH", color: "pink", price: 140, rent: 10 },
  { name: "Transit Hostel", color: "pink", price: 160, rent: 12 },
  { name: "Admin Block", color: "orange", price: 180, rent: 14 },
  { name: "BR Audi", color: "orange", price: 200, rent: 16 },
  { name: "Mini OAT", color: "orange", price: 200, rent: 16 },
  { name: "Amul Lane", color: "red", price: 200, rent: 18 },
  { name: "OAT", color: "red", price: 260, rent: 22 },
  { name: "Dosa Plaza", color: "yellow", price: 260, rent: 22 },
  { name: "Health Centre", color: "yellow", price: 260, rent: 22 },
  { name: "VC House", color: "yellow", price: 230, rent: 24 },
  { name: "VLB", color: "green", price: 300, rent: 26 },
  { name: "KCH", color: "green", price: 300, rent: 26 },
  { name: "SNH", color: "green", price: 250, rent: 28 },
  { name: "Sports Complex", color: "darkblue", price: 200, rent: 35 },
  { name: "Concert Ground", color: "darkblue", price: 350, rent: 50 },
];

const STATIONS = [
  { name: "Academic Block", price: 200 },
  { name: "Science Block", price: 200 },
  { name: "SPS", price: 200 },
  { name: "Pragya Bhawan", price: 200 },
];

const UTILITIES = [
  { name: "DTU Lake", price: 150 },
  { name: "Mic Mac", price: 150 },
];

const Properties = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 3000,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '20px'
    }}>
      <div className="glass" style={{ 
        width: '100%', maxWidth: '600px', maxHeight: '90vh', 
        overflowY: 'auto', padding: '30px', position: 'relative'
      }}>
        
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: '20px', right: '20px',
            background: 'transparent', border: 'none', color: 'white',
            cursor: 'pointer'
          }}
        >
          <X size={32} />
        </button>

        <h2 style={{ marginTop: 0, textAlign: 'center', color: 'var(--dtu-blue)' }}>Property Guide</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 20px 0' }}>
          Reference guide for property deeds and rents.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {BOARD_PROPERTIES.map((prop, i) => (
            <div key={i} className={`glass prop-${prop.color}`} style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{prop.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rent: M{prop.rent}</p>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                M{prop.price}
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '30px', marginBottom: '15px', color: 'var(--dtu-yellow)' }}>Stations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {STATIONS.map((station, i) => (
            <div key={i} className="glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '8px solid #cbd5e1' }}>
              <h3 style={{ margin: 0 }}>{station.name}</h3>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>M{station.price}</div>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '30px', marginBottom: '15px', color: 'var(--text-main)' }}>Utilities / Other</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {UTILITIES.map((utility, i) => (
            <div key={i} className="glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '8px solid #cbd5e1' }}>
              <h3 style={{ margin: 0 }}>{utility.name}</h3>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>M{utility.price}</div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Properties;
