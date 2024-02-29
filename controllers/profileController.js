const db = require("../database/db");
const httpstatus = require("../util/httpstatus");


// contact information start

const getContactInformation = async (req,res) => {
   try {
    const { id } = req.body
    const result = await db('ContactInformation').select('*').where({ userid:id }).first();
    if(result){
      return res.send(httpstatus.successRespone(
        { 
          message: "Contact Information", 
          response: result
        }
        ));
    }else{
      return res.send(httpstatus.notFoundResponse({ message: null }));

    }
   } catch (error) {
     return res.send(httpstatus.errorRespone({ message: error.message }));

   }
}

const contactInformation = async (req, res) => {
  try {
    const {
      userid,
      Street,
      place,
      taluk,
      district,
      zipcode,
      idproof,
      idnumber,
      issueDate,
      country,
      IssuingAuthority,
      plotnumber,
      plotname
    } = req.body;

       db("ContactInformation")
      .insert({
        userid:userid,
        Street:Street,
        place:place,
        taluk:taluk,
        district:district,
        zipcode:zipcode,
        idproof:idproof,
        idnumber:idnumber,
        issueDate:issueDate,
        country:country,
        IssuingAuthority:IssuingAuthority,
        plotnumber:plotnumber,
        plotname:plotname

      })
      .then((response) => {
        return res.send(httpstatus.successRespone(
          { 
            message: "Contact Information inserted successfully", 
            response: response }
          ));

      })
      .catch((error) => {
        return res.send(httpstatus.errorRespone({ message: error.message }));

      });
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};


const ContactUpdate = async (req, res) => {
  try {
    const {
      userid,
      Street,
      place,
      taluk,
      district,
      zipcode,
      idproof,
      idnumber,
      issueDate,
      country,
      IssuingAuthority,
      plotnumber,
      plotname
    } = req.body;

    db('ContactInformation').update({
       userid:userid,
        Street:Street,
        place:place,
        taluk:taluk,
        district:district,
        zipcode:zipcode,
        idproof:idproof,
        idnumber:idnumber,
        issueDate:issueDate,
        country:country,
        IssuingAuthority:IssuingAuthority,
        plotnumber:plotnumber,
        plotname:plotname
    }).where({ userid : userid })
    .then((response)=>{
      return res.send(httpstatus.successRespone(
        { 
          message: "Contact Information Updated successfully", 
          response: response }
        ));
    }).catch((error)=>{
      return res.send(httpstatus.errorRespone({ message: error.message }));
    })
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
}

// contact information end


// Personal Details start
const fetchInformation = async (req,res) => {
  try {
   const { id,table } = req.body
   console.log(req.body);
   const result = await db(table).select('*').where({ userid:id }).first();
  
   const jobSkills = await db('JobSkills').select('*').where({ jod_details_id:result.id });
   if(result){
    return res.send(httpstatus.successRespone({
      message: "Details Fetched",
      response: result,
      jobSkills: jobSkills,
    }));
    
   }else{
     return res.send(httpstatus.notFoundResponse({ message: null }));

   }
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));

  }
}

 
const AddUserDetails = async (req, res) => {
  try {
    const { insertdata, table, insertMessage, skills,resume } = req.body;

    console.log('resume details',req.body);
    console.log(resume);
    // Insert user details and get the inserted ID
    const response = await db(table).insert(insertdata).returning('id','userid');
    const insertedId = response[0];
    if(resume && resume.length > 0){
     await db('JobDetails').update({resume: req.file ? req.file.filename : "sads"}).where({ userid: insertedId.userid});
    }
   

    // Insert skills if provided
    if (skills && skills.length > 0) {
      await db('JobSkills').insert(
        skills.map((skillsdata) => ({
          jod_details_id: insertedId.id,
          skills: skillsdata.name,
          skills_level: skillsdata.level,
        }))
      );

      console.log('Skills added successfully');
    }

    return res.send(httpstatus.successRespone({
      message: insertMessage,
      response: { insertedId },
    }));
  } catch (error) {
    console.log(error);
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};


const UpdateUserDetails = async (req, res) => {
  try {
    const {
      insertdata,table,insertMessage
    } = req.body;
    delete insertdata.id;
       db(table)
      .update(insertdata)
      .then((response) => {
        return res.send(httpstatus.successRespone(
          { 
            message: insertMessage, 
            response: response 
          
          }
          ));

      })
      .catch((error) => {
        return res.send(httpstatus.errorRespone({ message: error.message }));

      });
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
};


module.exports = {
  contactInformation,
  getContactInformation,
  ContactUpdate,
  fetchInformation,
  AddUserDetails,
  UpdateUserDetails
};
