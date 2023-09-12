import React, { useState, useEffect } from 'react';
import PlayerCard from "./PlayerCard";
import BULLET from "../assets/bullet.png"
import INJURY from "../assets/injury.png"
import BOMBPLANTED from "../assets/bombPlanted.png";
// Equipment
import assaultSuit from '../assets/itemAssets/item_assaultsuit.svg';
import defuser from '../assets/itemAssets/item_defuser.svg';
import kevlarImg from '../assets/itemAssets/item_kevlar.svg';

// Rifles
import ak47 from '../assets/itemAssets/weapon_ak47.svg';
import aug from '../assets/itemAssets/weapon_aug.svg';
import famas from '../assets/itemAssets/weapon_famas.svg';
import galilar from '../assets/itemAssets/weapon_galilar.svg';
import m4a1 from '../assets/itemAssets/weapon_m4a1.svg';
import m4a1Silencer from '../assets/itemAssets/weapon_m4a1_silencer.svg';
import sg556 from '../assets/itemAssets/weapon_sg556.svg';

// SMGs
import bizon from '../assets/itemAssets/weapon_bizon.svg';
import mac10 from '../assets/itemAssets/weapon_mac10.svg';
import mp7 from '../assets/itemAssets/weapon_mp7.svg';
import mp9 from '../assets/itemAssets/weapon_mp9.svg';
import p90 from '../assets/itemAssets/weapon_p90.svg';
import ump45 from '../assets/itemAssets/weapon_ump45.svg';

// LMGs
import m249 from '../assets/itemAssets/weapon_m249.svg';
import negev from '../assets/itemAssets/weapon_negev.svg';

// Snipers
import awp from '../assets/itemAssets/weapon_awp.svg';
import g3sg1 from '../assets/itemAssets/weapon_g3sg1.svg';
import scar20 from '../assets/itemAssets/weapon_scar20.svg';
import ssg08 from '../assets/itemAssets/weapon_ssg08.svg';

// Shotguns
import mag7 from '../assets/itemAssets/weapon_mag7.svg';
import nova from '../assets/itemAssets/weapon_nova.svg';
import sawedoff from '../assets/itemAssets/weapon_sawedoff.svg';
import xm1014 from '../assets/itemAssets/weapon_xm1014.svg';

// Pistols
import cz75a from '../assets/itemAssets/weapon_cz75a.svg';
import deagle from '../assets/itemAssets/weapon_deagle.svg';
import elite from '../assets/itemAssets/weapon_elite.svg';
import glock from '../assets/itemAssets/weapon_glock.svg';
import hkp2000 from '../assets/itemAssets/weapon_hkp2000.svg';
import p250 from '../assets/itemAssets/weapon_p250.svg';
import revolver from '../assets/itemAssets/weapon_revolver.svg';
import tec9 from '../assets/itemAssets/weapon_tec9.svg';
import uspSilencer from '../assets/itemAssets/weapon_usp_silencer.svg';
import fiveseven from '../assets/itemAssets/weapon_fiveseven.svg';

// Knives
import bayonet from '../assets/itemAssets/weapon_bayonet.svg';
import butterfly from '../assets/itemAssets/weapon_knife_butterfly.svg';
import falchion from '../assets/itemAssets/weapon_knife_falchion.svg';
import flip from '../assets/itemAssets/weapon_knife_flip.svg';
import gut from '../assets/itemAssets/weapon_knife_gut.svg';
import karambit from '../assets/itemAssets/weapon_knife_karambit.svg';
import m9Bayonet from '../assets/itemAssets/weapon_knife_m9_bayonet.svg';
import push from '../assets/itemAssets/weapon_knife_push.svg';
import knifeT from '../assets/itemAssets/weapon_knife_t.svg';
import tactical from '../assets/itemAssets/weapon_knife_tactical.svg';

// Grenades
import decoy from '../assets/itemAssets/weapon_decoy.svg';
import flashbang from '../assets/itemAssets/weapon_flashbang.svg';
import hegrenade from '../assets/itemAssets/weapon_hegrenade.svg';
import incgrenade from '../assets/itemAssets/weapon_incgrenade.svg';
import molotov from '../assets/itemAssets/weapon_molotov.svg';
import smokegrenade from '../assets/itemAssets/weapon_smokegrenade.svg';

// Other Equipment
import taser from '../assets/itemAssets/weapon_taser.svg';


const weaponImages = {
  // Equipment
  assaultSuit,
  defuser,
  kevlar:kevlarImg,

  // Rifles
  ak47,
  aug,
  famas,
  galilar,
  m4a1,
  m4a1_silencer:m4a1Silencer,
  sg556,

  // SMGs
  bizon,
  mac10,
  mp7,
  mp9,
  p90,
  ump45,

  // LMGs
  m249,
  negev,

  // Snipers
  awp,
  g3sg1,
  scar20,
  ssg08,

  // Shotguns
  mag7,
  nova,
  sawedoff,
  xm1014,

  // Pistols
  cz75a,
  deagle,
  elite,
  glock,
  hkp2000,
  p250,
  revolver,
  tec9,
  usp_silencer:uspSilencer,
  fiveseven,

  // Knives
  bayonet,
  butterfly,
  falchion,
  flip,
  gut,
  karambit,
  m9Bayonet,
  push,
  knifeT,
  tactical,

  // Grenades
  decoy,
  flashbang,
  hegrenade,
  incgrenade,
  molotov,
  smokegrenade,

  // Other Equipment
  taser
};


const primaryWeapons = [
  // Assault Rifles
  'ak47', 'aug', 'famas', 'galilar', 'm4a1', 'm4a1_silencer', 'sg556',
  // SMGs
  'mac10', 'mp7', 'mp9', 'bizon', 'ump45', 'p90',
  // LMGs
  'm249', 'negev',
  // Snipers
  'awp', 'g3sg1', 'ssg08', 'scar20',
  // Shotguns
  'mag7', 'nova', 'sawedoff', 'xm1014'
];

const secondaryWeapons = [
'deagle', 'elite', 'glock', 'hkp2000', 'p250', 'revolver', 'usp_silencer', 'tec9', 'cz75a', 'fiveseven'
];

function PrimaryWeaponDisplay({ weaponName }) {
return (
    <img src={weaponImages[weaponName]} style={{display:'flex',width:'50%', objectFit:'contain', marginRight:"5px", height:'30px', alignSelf:'center'}}/>
);
}

function SecondaryWeaponDisplay({ weaponName }) {
  return (
      <img src={weaponImages[weaponName]} style={{display:'flex',width:'30%', objectFit:'contain', height:'30px',marginRight:"5px", alignSelf:'center',}}/>
  );
  }
  


function TeamSide({ players }) {

  function ItemsOwned({player, kevlar, kevlarWithHelmet, defuseKit, bomb, primaryWeapon, primaryWeaponType, secondaryWeapon, secondaryWeaponType}){

    return(
      <div style={{display:'flex', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', width:'100px', borderRadius:"10px", marginTop:'10px', justifyContent:'center', height:'40px', opacity:player.isDead?0.2:1, alignSelf:'center'}}>
      {(defuseKit)?
      <img src={defuser} style={{display:'flex', width:'20%', objectFit:'contain', marginLeft:'5px'}}/>:null}
      {(bomb)?
      <img src={BOMBPLANTED} style={{display:'flex', width:'20%', objectFit:'contain', marginLeft:'5px'}}/>:null}
      {(kevlar)?
      <img src={kevlarImg} style={{display:'flex', width:'20%', objectFit:'contain', marginLeft:'5px'}}/>:null}
      {(kevlarWithHelmet)?
      <img src={assaultSuit} style={{display:'flex', width:'20%', objectFit:'contain', marginLeft:'5px'}}/>:null}
      {(primaryWeapon)?     
      <PrimaryWeaponDisplay weaponName={primaryWeaponType}/>:null}
      {(!primaryWeapon && secondaryWeapon)?     
      <SecondaryWeaponDisplay weaponName={secondaryWeaponType}/>:null}
    </div>
    );

  }

  function BlinkingBullet({player, kevlar, kevlarWithHelmet, defuseKit, bomb, primaryWeapon, primaryWeaponType, secondaryWeapon, secondaryWeaponType}) {
    const [opacity, setOpacity] = useState(1);
    const [direction, setDirection] = useState(-1);
    const [blinkCount, setBlinkCount] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        if (blinkCount >= 3) {
          clearInterval(interval);
          return;
        }

        setOpacity(prevOpacity => {
            let newOpacity = prevOpacity + (0.02 * direction);
            
            if (newOpacity <= 0.2) {
                newOpacity = 0.2;
                setDirection(1);
            } else if (newOpacity >= 1) {
                newOpacity = 1;
                setDirection(-1);

                // Increment the blinkCount when opacity returns to full
                setBlinkCount(prevCount => prevCount + 1);
            }

            return newOpacity;
        });
    }, 8);

    return () => clearInterval(interval);
    }, [direction, blinkCount]);

    if (blinkCount >= 3) return <ItemsOwned player = {player}  
    kevlar = {kevlar}
    kevlarWithHelmet = {kevlarWithHelmet}
    defuseKit = {defuseKit}
    bomb = {bomb}
    primaryWeapon = {primaryWeapon}
    primaryWeaponType = {primaryWeaponType}
    secondaryWeapon = {secondaryWeapon}
    secondaryWeaponType = {secondaryWeaponType}/>;

    return (
      <div style={{display:"flex", width:"42px", height:'25px', backgroundColor:'orange', justifyContent:'center', borderRadius:'20px', marginTop:'10px', alignSelf:'center', opacity:opacity}}>
      <img src={BULLET} style={{width:'18px', height:"20px", alignSelf:'center', marginTop:'4px', marginBottom:'4px'}}/>
    </div>
    );
  }

  function BlinkingDamage({player, kevlar, kevlarWithHelmet, defuseKit, bomb, primaryWeapon, primaryWeaponType, secondaryWeapon, secondaryWeaponType}) {
    const [opacity, setOpacity] = useState(1); // Starting with full opacity
    const [direction, setDirection] = useState(-1);  // -1 for decreasing, 1 for increasing
    const [blinkCount, setBlinkCount] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {

        if (blinkCount >= 3) {
          clearInterval(interval);
          return;
        }

        setOpacity(prevOpacity => {
            let newOpacity = prevOpacity + (0.02 * direction); // Adjusting opacity by 0.02 each time
            
            if (newOpacity <= 0.2) {  // Lower limit
                newOpacity = 0.2;
                setDirection(1); // Switch direction to increasing
            } else if (newOpacity >= 1) {  // Upper limit
                newOpacity = 1;
                setDirection(-1); // Switch direction to decreasing
                // Increment the blinkCount when opacity returns to full
                setBlinkCount(prevCount => prevCount + 1);
            }

            return newOpacity;
        });
    }, 8);  // Adjust opacity every 25ms
    return () => clearInterval(interval);
    }, [direction]);

    if (blinkCount >= 3) return <ItemsOwned     
    player = {player}          
    kevlar = {kevlar}
    kevlarWithHelmet = {kevlarWithHelmet}
    defuseKit = {defuseKit}
    bomb = {bomb}
    primaryWeapon = {primaryWeapon}
    primaryWeaponType = {primaryWeaponType}
    secondaryWeapon = {secondaryWeapon}
    secondaryWeaponType = {secondaryWeaponType}/>
    
    ;

    return (
        <div style={{display:"flex", width:"42px", height:'25px', backgroundColor:'#eb635b', justifyContent:'center', borderRadius:'20px', marginTop:'10px', alignSelf:'center', opacity:opacity}}>
            <img src={INJURY} style={{width:'18px', height:"20px", alignSelf:'center', marginTop:'4px', marginBottom:'4px'}}/>
          </div>
    );
  }

  return (
    <div className="team-side">
      {players.map((player) => {

        let kevlar = false;
        let kevlarWithHelmet = false;

        let defuseKit = false;
        let bomb = false;
         
        let primaryWeapon = false;
        let primaryWeaponType = null;

        let secondaryWeapon = false;
        let secondaryWeaponType = null;

        if(player.itemsOwned!=null){
        for(let n=0; n<=player.itemsOwned.length-1; n++){
          if(player.itemsOwned[n].id == 'kevlarVest' && player.itemsOwned[n].equipped == true){
            kevlar = true;
          }
          else if(player.itemsOwned[n].id == 'helm'&& player.itemsOwned[n].equipped == true){
            kevlarWithHelmet = true;
            kevlar = false;
          }
          else if(player.itemsOwned[n].id == 'bomb' && player.itemsOwned[n].equipped == true){
            bomb = true;
          }
          else if(player.itemsOwned[n].id == 'defuser' && player.itemsOwned[n].equipped == true){
            defuseKit = true;
          }
          else{
            for (let p=0; p<=primaryWeapons.length-1; p++){
              if(primaryWeapons[p] == player.itemsOwned[n].id && player.itemsOwned[n].equipped == true){
                primaryWeapon = true;
                primaryWeaponType = player.itemsOwned[n].id 
                break;
              }
            }
            for (let p=0; p<=secondaryWeapons.length-1; p++){
              if(secondaryWeapons[p] == player.itemsOwned[n].id && player.itemsOwned[n].equipped == true){
                secondaryWeapon = true;
                secondaryWeaponType = player.itemsOwned[n].id ;
                break;
              }
            }
          }

        }
        }


        return(
          <div style={{display:'flex', flexDirection:'column',}}>
          <PlayerCard key={player.id} player={player} />

            {(player.damageDealtInstant == true || player.damageTakenInstant == true)?
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignSelf:'center'}}>
            {(player.damageDealtInstant == true)?
            <BlinkingBullet player={player}
              kevlar = {kevlar}
              kevlarWithHelmet = {kevlarWithHelmet}
              defuseKit = {defuseKit}
              bomb = {bomb}
              primaryWeapon = {primaryWeapon}
              primaryWeaponType = {primaryWeaponType}
              secondaryWeapon = {secondaryWeapon}
              secondaryWeaponType = {secondaryWeaponType}
            />:null}
            {(player.damageTakenInstant == true)?
            <BlinkingDamage player={player}
              kevlar = {kevlar}
              kevlarWithHelmet = {kevlarWithHelmet}
              defuseKit = {defuseKit}
              bomb = {bomb}
              primaryWeapon = {primaryWeapon}
              primaryWeaponType = {primaryWeaponType}
              secondaryWeapon = {secondaryWeapon}
              secondaryWeaponType = {secondaryWeaponType}
            />:null}
            </div>:<ItemsOwned player={player}
              kevlar = {kevlar}
              kevlarWithHelmet = {kevlarWithHelmet}
              defuseKit = {defuseKit}
              bomb = {bomb}
              primaryWeapon = {primaryWeapon}
              primaryWeaponType = {primaryWeaponType}
              secondaryWeapon = {secondaryWeapon}
              secondaryWeaponType = {secondaryWeaponType}
            />
            }
          </div>
        )
      })}
    </div>
  );
}

export default TeamSide;
