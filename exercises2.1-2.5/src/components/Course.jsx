const Header=(props)=> {
    return (
           <h1>{props.course}</h1>
    )
  }
  const  Part=(props)=> {
    console.log(props.part.name)
    return (
            <p>{props.part.name} {props.part.exercises}</p>
     )
  }  
  const Total= (props)=> {
      const total = props.parts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.exercises,
      0,
    );
  return (
    <p><strong>Number of exercises {total}</strong> </p>
  )
  }
  const Content = (props) => {
    
    return (
     <>
     {props.parts.map((part, index) => (
       <Part key={index} part={part} />
     ))}
    </>
     )
     }
  const Course = (props) => {
    //console.log(props.course.parts[0].exercises);
    return (
      <div>
        <Header course={props.course.name} />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts} />
      </div>
    )
  }
  export default Course
  