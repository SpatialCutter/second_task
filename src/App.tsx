import { Stack, Container, Row, Col, Image, Badge, Card, CardTitle, CardText, Button, CloseButton, CardBody } from "react-bootstrap";
import { Fragment } from "react";
import { TbPokeball } from "react-icons/tb";
import { FaCircleQuestion } from "react-icons/fa6";
import { MdArrowForwardIos } from "react-icons/md";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/pokemontypes.css"
import "./styles/style.css"
import { useState } from "react";

// для поиска react-bootstrap bootstrap
type Pokemon = {
  index: number,
  name: string,
  image: string,
  properties: PokemonProperties,
  stats: PokemonStat[],
  evolutions: PokemonBrief[]
}

type PokemonStat = {
  label: string,
  level: number
}

type PokemonProperties = {
  height: number,
  weight: number,
  gender: ("Male" | "Female" | "Unknown")[],
  category: string,
  abilities: PokemonAbility[]
}

type PokemonBrief = {
  index: number,
  name: string,
  image: string,
  type: string[]
}

type PokemonAbility = {
  name: string,
  description: string
}

function PokemonStatsCard({stats} : {stats: PokemonStat[]}) {
  return <Card body bg="secondary" className="p-1">
    <CardTitle className="text-start">Stats</CardTitle>
    <Stack direction="horizontal" className="p-3 pb-0" gap={2}>
      {stats.map( (n: PokemonStat, index: number) => <StatColumn key={index} stat={n}/>)}
    </Stack>
  </Card>
}

function StatColumn({stat} : {stat: PokemonStat}) {
  const slotsCount = 15;
  let slots: boolean[] = new Array<boolean>(slotsCount).fill(false);
  slots.fill(true, slotsCount - stat.level);

  return <Stack gap={1} style={{"width": "2rem"}}>
    { slots.map( (n: boolean, index: number) => n ? <Badge key={index} bg="info"> </Badge> : <Badge key={index} bg="light"> </Badge> ) }
    <p className="stat__label">{stat.label}</p>
  </Stack>
}

function PokemonDescription() {
  const [pokemonVersion, setPokemonVersion] = useState<("red" | "blue")>("blue");

  const onVersionButtonClick: (type: "red"|"blue") => void = (type) => {
    setPokemonVersion(type);
  }

  return <>
    { pokemonVersion==="blue" ? 
    <p className="text-start fs-5">When the seal on its chest is removed, it rages indiscriminately. During such rampages, it can turn a whole town into a mountain of rubble.</p> :
    <p className="text-start fs-5">Golurk were created by ancient people to protect both people and Pokémon. They run on a mysterious energy</p> }
    <Stack direction="horizontal" gap={3}>
      <p className="fs-5">Version: </p>
      <PokemonVersionButton isActive={pokemonVersion==="blue"} pokemonVersion="blue" onClick={onVersionButtonClick}/>
      <PokemonVersionButton isActive={pokemonVersion==="red"} pokemonVersion="red" onClick={onVersionButtonClick}/>      
    </Stack>    
  </>
}

function PokemonVersionButton({isActive, pokemonVersion, onClick} : {isActive: boolean, pokemonVersion: ("red" | "blue"), onClick: (type: ("red" | "blue")) => void}) {
  return <div className={`pokeball__${pokemonVersion} ${isActive ? "pokeball__active" : "pokeball"}`}
    onClick={() => onClick(pokemonVersion)}>    
    <TbPokeball role="button" size={30} color="white"/>
  </div>
}

function ButtonsGrid({header, buttons, columnCount} : {header: (string | null), buttons: string[], columnCount: number}) {
  const rowCount = Math.ceil(buttons.length/columnCount);
  const buttonRows: string[][] = new Array<string[]>(rowCount);
  for (let _i = 0; _i < rowCount; _i++)
    buttonRows[_i] = buttons.slice(_i*columnCount, _i*columnCount+columnCount);

  return <>
    { header && <p className="text-start fs-5">{header}</p> }
    <Container>
      { buttonRows.map((n: string[], nindex: number) => {
        return <Row sm={columnCount} className="" key={nindex}>{n.map((m: string, mindex: number) => {
          return <Col className="pb-2" key={mindex}>
            <Button className={`w-100 ${m.toLowerCase()}`} href={`https://www.pokemon.com/uk/pokedex/?type=${m}`}>{m}</Button>
          </Col>
        })}</Row>
      } ) } 
    </Container>
  </>
}

function PokemonPropertiesCard({properties} : {properties: PokemonProperties}) {
  const [selectedAbility, setSelectedAbility] = useState<(PokemonAbility | null)>(null);

  const onAbilityClick: (ability: PokemonAbility) => void = (ability) => {
    setSelectedAbility(ability);
  }

  const abilityCloseHandle: () => void = () => (setSelectedAbility(null));

  return <> { (selectedAbility === null) ?
  <Card body bg="info" className="p-0" role="table">
    <Container className="text-start">
      <Row className="m-0">
        <Col>
          <CardTitle className="text-light fs-6">Height</CardTitle>
          <CardText className="fs-5">{`${properties.height} m`}</CardText>
          <CardTitle className="text-light fs-6">Weight</CardTitle>
          <CardText className="fs-5">{`${properties.weight} kg`}</CardText>
          <CardTitle className="text-light fs-6">Gender</CardTitle>
          <CardText className="fs-5">{properties.gender.map((n: string) => `${n} `)}</CardText>
        </Col>
        <Col>
          <CardTitle className="text-light fs-6">Category</CardTitle>
          <CardText className="fs-5">{properties.category}</CardText>
          <CardTitle className="text-light fs-6">Abilities</CardTitle>
          {properties.abilities.map((n: PokemonAbility, index: number) => 
            <PokemonAbilityButton key={index} ability={n} onClick={onAbilityClick}/>
          )}
        </Col>
      </Row>
    </Container>
  </Card> : <PokemonAbilityDetail ability={selectedAbility} closeHandle={abilityCloseHandle}/>
  } </>
}

function PokemonAbilityDetail({ability, closeHandle} : {ability: PokemonAbility, closeHandle: () => void}) {
  return <Card bg="dark">
    <CardBody>
      <CardText className="text-start fs-6 text-secondary">ability info</CardText>
      <CloseButton className="float-end" variant="white" onClick={() => closeHandle()}/>
      <CardTitle className="text-start text-light">{ability.name}</CardTitle>
      <CardText className="text-start text-light">{ability.description}</CardText>      
    </CardBody>
  </Card>
}

function PokemonAbilityButton({ability, onClick} : {ability: PokemonAbility, onClick: (ability: PokemonAbility) => void}) {
  return <CardText role="button" className="fs-5" onClick={() => (onClick(ability))}>
    {`${ability.name}\t`}
    <FaCircleQuestion size={15} color="white"/>
  </CardText>
}

function Evolution({evolutions} : {evolutions: PokemonBrief[]}) {
  return <Container className="evolution">
    <Row key={1}>
      <p className="fs-5 text-start">Evolution</p>
    </Row>
    <Row key={2} className="justify-content-center align-items-center">
      {evolutions.map((n: PokemonBrief, index: number, array: PokemonBrief[]) => {
        return <Fragment key={index}> <Col key={index} sm="auto">
          <EvolutionCard brief={n}/>          
        </Col>
        { (index !== array.length-1) && 
          <Col key={index+100} sm="auto">
            <MdArrowForwardIos size={60}/>
          </Col>}
        </Fragment>
      })}
    </Row>
    
  </Container>;
}

function EvolutionCard({brief} : {brief: PokemonBrief}) {
  return <Stack gap={2} className="justify-content-center align-items-center">
    <Image src={brief.image} height={170} width={170} className="evolution__image"/>
    <PokemonName name={brief.name} index={brief.index} fontsize={6}/>
    <ButtonsGrid buttons={brief.type} header={null} columnCount={2}/>
  </Stack>
}

function PokemonName({name, index, fontsize} : {name: string, index: number, fontsize: number}) {
  return <strong className={`fs-${fontsize}`}>{name} <span style={{color: "#a4acaf"}}>#{index}</span></strong>
}

function PokemonPage({pokemon} : {pokemon: Pokemon}) {
  return (
    <>
      <Container fluid="s" className="m-5 p-4 mt-1 pt-1">
        <Row className="p-2 pb-5">
          <PokemonName name="Golurk" index={623} fontsize={3}/>
        </Row>
        <Row>
          <Col>
            <div className="p-2 mb-4 pokemon__image">
              <Image src={pokemon.image} width={430} height={430}/>
            </div>
            <PokemonStatsCard stats={pokemon.stats}/>
          </Col>
          <Col>
            <Stack gap={3}>
              <PokemonDescription/>
              <PokemonPropertiesCard properties={pokemon.properties}/>
              <ButtonsGrid header="Type" buttons={["Ground", "Ghost"]} columnCount={3}/>
              <ButtonsGrid header="Weaknesses" buttons={["Water", "Grass", "Ice", "Ghost", "Dark"]} columnCount={3}/>
            </Stack>
          </Col>
        </Row>
        <Row>
          <Evolution evolutions={pokemon.evolutions}/>
        </Row>
        <Row className="float-end">
          <Button className="w-auto" variant="warning" href="https://www.pokemon.com/uk/pokedex/">Explore More Pokemon</Button>
        </Row>
      </Container>
    </>
  );
}

function App() {
  const stats: PokemonStat[] = [
    { label: "HP", level: 6 },
    { label: "Attack", level: 8 },
    { label: "Defense", level: 5 },
    { label: "Special Attack", level: 4 },
    { label: "Special Defense", level: 5 },
    { label: "Speed", level: 4 },
  ];

  const properties: PokemonProperties = {
    height: 2.8,
    weight: 330,
    gender: ["Unknown"],
    category: "Automation",
    abilities: [
      {name: "Klutz", description: "The Pokémon can’t use any held items."}, 
      {name: "Iron Fist", description: "Powers up punching moves."}
    ]
  }

  const evolutions: PokemonBrief[] = [
    {
      index: 622,
      name: "Gollet",
      image: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/622.png",
      type: ["Ground", "Ghost"]
    },
    {
      index: 623,
      name: "Golurk",
      image: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/623.png",
      type: ["Ground", "Ghost"]
    }
  ]

  const pokemon: Pokemon = {
    index: 623,
    name: "Golurk",
    image: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/623.png",
    properties: properties,
    stats: stats,
    evolutions: evolutions
  }

  return (
    <main>
      <PokemonPage pokemon={pokemon}/>
    </main>
  );
}

export default App;
