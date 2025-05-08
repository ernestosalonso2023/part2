import { useEffect, useState } from 'react'
import axios from 'axios'
import contactService from './services/persons.js'

const Person=(props) => {
 // console.log("person", props)
  return (
    <div>
      {props.name} {props.number} <button className='btn btn-primary' onClick={props.remove} value={props.id}>delete</button>
      
    </div>
  )
}
const Filter= (props) => {
  //console.log("filter nuevo")
  return (
    <div>
      filter shown with: <input value={props.newFilter} onChange={props.OnChangeFilter} />
    </div>
  )
}
const PersonForm = (props) => {
  return (
    <form>
    <div>
      name: <input value={props.newName}  onChange={props.OnChangeContactName}/>
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.OnChangeContactNumber}/>
    </div>
    <div>
      <button type="submit" onClick={props.AddContact}>add</button>
    </div>
  </form>)
}
const Persons= (props) => {
  return (
    <div>
      {props.persons.map((person, index) => (
        <Person key={index} name={person.name} number={person.number} id={person.id} remove={props.remove} />
              ))}
    </div>
  )
}

const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }
  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('') 
  const [newFilter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
 // const [errorMessage, setNotificacion] = useState(null)
 const [notification, setMessage] = useState({message: null, type: null})
  
  useEffect(() => {
    contactService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setFilteredPersons(initialPersons)
      })
  }
  , [])
  
  const AddContact = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    const names= persons.map((person) => person.name)
    const pos= names.indexOf(newName)
    if (pos!== -1) {
     if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personObject.id=persons[persons[pos].id],
        UpdateContact(persons[pos].id,personObject)
      }
    }
    else {
       contactService
          .create(personObject)
          .then(contact => {
            //console.log("add OK", response)
            setNewName(''),
            setNewNumber(''),
            setPersons(persons.concat(contact)),
            setFilteredPersons(persons.concat(contact))
            setMessage({message:`Added contact: '${contact.name}'`, type: 'success'})
            setTimeout(() => {
              setMessage({ message: null, type: null })
            }, 4000)
          })
          .catch(error => {
            setMessage({ message: `Error adding contact: '${error}'`, type: 'error' })
            setTimeout(() => {
              setMessage({ message: null, type: null })
            }, 4000)
          })           
  }
}
  const UpdateContact = (id,newObject) => { 
  //console.log("update", id)
    contactService
      .update(id, newObject)
      .then(contact => {
        setPersons(persons.map((person) => (person.id !== id ? person : contact)))
        setFilteredPersons(persons.map((person) => (person.id !== id ? person : contact)))
        setNewName('')
        setNewNumber('')
        setMessage({ message: `Updated contact: '${contact.name}'`, type: 'success' })
        setTimeout(() => {
          setMessage({ message: null, type: null })
        }, 6000)
      })
      .catch(error => {
        setMessage({ message: `Error updating contact: '${error}'`, type: 'error' })
        setTimeout(() => {
          setMessage({ message: null, type: null })
        }
        , 6000)
        //alert('Error updating contact:'+ error)
      }) 
  }
  const RemoveContact= (event) => {
    const id=event.target.value
    const person=persons.find((person) => person.id === id)
    console.log("remove", id)
     if (window.confirm(`Delete ${person.name} ?`)) {
      contactService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          setFilteredPersons(persons.filter((person) => person.id !== id))
          setMessage({ message: `Deleted contact: '${person.name}' successfully`, type: 'success' })
          setTimeout(() => {
            setMessage({ message: null, type: null })
          }, 4000)
        })
        .catch((error) => {
          alert('Error deleting contact:'+ person.name+ ' was already deleted')
        })
    }
  }
  const OnChangeContactName = (event) => {
    setNewName(event.target.value)
  }
  const OnChangeContactNumber = (event) => {
    setNewNumber(event.target.value)
  } 
  const OnChangeFilter = (event) => {
    setFilter(event.target.value)
    const founds=persons.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    //console.log(founds)
    setFilteredPersons(founds)
    if (event.target.value ==="") {
      setFilteredPersons(persons)
    }
  }
  return (
    <>
    <Notification notification={notification} />
    <div>
      <h2>Phonebook</h2>
      <Filter 
        newFilter={newFilter} 
        OnChangeFilter={OnChangeFilter}
       />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        OnChangeContactName={OnChangeContactName}
        OnChangeContactNumber={OnChangeContactNumber}
        AddContact={AddContact}
      />
        <h2>Numbers</h2>
          <Persons persons={filteredPersons} remove={RemoveContact} />
     </div>
     </>
  )
}

export default App