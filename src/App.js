import React, { useState } from 'react';
import {Container,TextField,Button,Select,MenuItem,InputLabel,FormControl,RadioGroup,FormControlLabel,Radio} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib'


function App() {

  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), firstName: '', lastName: '', role: '', time: ''},
  ]);

  const roles = ['Developer','Testing','Admin','Marketing']
  const roleTime = ['parttime','fulltime']

  const createPDfForm = async() =>{
    const pdfDoc = await PDFDocument.create()
    
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const form = pdfDoc.getForm()
    
    let textFieldHeight = height

    inputFields.forEach((field)=>{
      let textFieldWidth = 0

      //creating firstname and lastname
      const firstNameField = form.createTextField(`${field.id}firstName`)
      const lastNameField = form.createTextField(`${field.id}lastName`)

      firstNameField.setText(field.firstName)
      lastNameField.setText(field.lastName )

      textFieldHeight = textFieldHeight - 40
      textFieldWidth = textFieldWidth + 50 
  
      firstNameField.addToPage(page,{ x: textFieldWidth, y: textFieldHeight,fontSize:20,width:70,height:20})
      lastNameField.addToPage(page,{ x: textFieldWidth+100, y: textFieldHeight,fontSize:20,width:70,height:20})
     
      lastNameField.setFontSize(10)
      firstNameField.setFontSize(10)

      
      //creating roles

      const roleField = form.createDropdown(`${field.id}roles`)
      roleField.addOptions(['Developer','Testing','Admin','Marketing'])
      roleField.select(field.role)
      roleField.addToPage(page, { x: textFieldWidth+ 200, y: textFieldHeight ,width:70,height:20})
      roleField.setFontSize(10)
      //creating time

      page.drawText('parttime', { x: textFieldWidth + 315, y: textFieldHeight+7, size: 14})
      page.drawText('fulltime', {  x: textFieldWidth + 415, y: textFieldHeight+7, size: 14})

      const timeField = form.createRadioGroup(`${field.id}time`)
      timeField.addOptionToPage('parttime', page, { x: textFieldWidth + 300, y: textFieldHeight+5,width:10,height:10 })
      timeField.addOptionToPage('fulltime', page, { x: textFieldWidth + 400, y: textFieldHeight+5,width:10,height:10 })
      timeField.select(field.time)
    })
   
    
  
    const pdfBytes = await pdfDoc.save()
    
    const blob = new Blob([pdfBytes], {type: 'application/pdf'})
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'example.pdf'
    link.click()
  }
 
  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map(i => {
      if(id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })
    
    setInputFields(newInputFields);
  }

  const handleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(), firstName: '', lastName: '', role:'', time:''}])
  }

  const exportPdf = async() => {
   createPDfForm()
}

  return (
    <Container>
      <h1>Add New Member</h1>
      <Button sx={{mb:2}} variant="contained" color="primary"onClick={handleAddFields}>Add Details</Button>
      <Button sx={{ml: 2,mb:2}} variant="contained" color="primary" onClick={exportPdf} >Export pdf</Button>
      <form >
        { inputFields.map(inputField => (
          <div key={inputField.id}>
            <TextField
              sx={{mb:2}}
              name="firstName"
              label="First Name"
              variant="outlined"
              value={inputField.firstName}
              onChange={event => handleChangeInput(inputField.id, event)}
            />
            <TextField
              sx={{ ml: 2,mb:2}}
              name="lastName"
              label="Last Name"
              variant="outlined"
              value={inputField.lastName}
              onChange={event => handleChangeInput(inputField.id, event)}
            />
            <FormControl sx={{ ml: 2, mb:2, width:200}} >
              <InputLabel >Role</InputLabel>
              <Select
                name="role"
                value={inputField.role}
                onChange={event => handleChangeInput(inputField.id, event)}
              >
                {
                  roles.map((ele,i) =>{
                    return <MenuItem key={i} value={ele}>{ele}</MenuItem>
                  })
                }
              </Select>
            </FormControl>
            <FormControl sx={{ ml: 2,mb:2}}>
              <RadioGroup
                row
                name="time"
                value={inputField.time}
                onChange={event => handleChangeInput(inputField.id, event)}
              >
                {roleTime.map((ele,i)=>{
                  return  <FormControlLabel  key={i} value={ele} control={<Radio />} label={ele} />
                })}
              
              </RadioGroup>
            </FormControl>
          </div>
        )) }
      </form>
    </Container>
  );
}

export default App;
