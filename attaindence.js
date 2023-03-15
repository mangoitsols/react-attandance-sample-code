const attandance = require("../models/attaindence");
const Student = require("../models/studentModel");
const User = require("../models/userModel");
const { createPDFForWeek } = require("./week_attandence_PDF");
const { createPDFForMonth } = require("./month_attandence_PDF");
var mongodb = require("mongodb");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const StudentClass = require("../models/classModel");
const date = require("date-and-time");
const moment = require("moment");

exports.attaindence_save = async (req, res) => {
 

  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");

  await attandance
    .find({
      date: req.body.date,
      studentId: req.body.studentId,
    })
    .then((result) => {
     
      if (result.length) {
        res.status(400).send({ message: "attaindence already save" });
      } else {
       
        const studentSave = new attandance({
          studentId: req.body.studentId,
          counsellor_id: req.body.counsellor_id,
          date: req.body.date,
          attendence: req.body.attendence,
          out_of_class: req.body.out_of_class,
          outclassDateTime: req.body.outclassDateTime,
          inclassDateTime: req.body.inclassDateTime,
          classId: req.body.classId,
        });
        studentSave
          .save()
          .then((response) => {
            res.status(200).send(response);
          

            if (response) {
              Student.findOneAndUpdate(
                { _id: req.body.studentId },
                {
                  // $push: { attaindence: response._id }
                  attaindence: response._id,
                },

                { new: true }
              )
                .then((result) => {
                  // console.log(result);
                })
                .catch((err) => {
                  // console.log(err);
                });

              // studentRecod
              //   .findOneAndUpdate(
              //     { student: req.body.studentId },
              //     {
              //       $push: { attaindence: response._id },
              //     },

              //     { new: true }
              //   )
              //   .then((data) => {
              //     console.log(data);
              //   })
              //   .catch((err) => {
              //     console.log(err);
              //   });
              // const studentRecords = new StudentRecords({
              //   studentId: req.body.studentId,
              //   attendence: response._id,
              //   classId: req.body.classId,
              //   createdAt: response.createdAt,
              //   updatedAt: response.updatedAt,
              // });
              // studentRecords.save();
            }
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      }
    });
};

exports.attendenceReport = async (req, res) => {
  const attaind = await attandance.find().populate("studentId");
  console.log(attaind);
};

exports.getAttaindence = async (req, res) => {
  const attaindence = await attandance.find().populate("studentId");
  try {
    await attandance.find().populate("studentId");
    res.status(200).json({ attaindence });
    console.log(res);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};

exports.startTime = (req, res) => {
  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");

  attandance
    .find({ $and: [{ studentId: req.params.id }, { date: value }] })
    .then((data) => {
      console.log(data);
      if (data.length) {
        attandance.findByIdAndUpdate(
          data[0]._id,
          {
            outclassDateTime: now,
          },
          { new: true },
          (err, updateTime) => {
            console.log(updateTime, "updateTime");
            if (err) {
              res.status(404).json({
                message: "please enter correct user id ",
                subErr: err.message,
              });
            } else {
              res.status(200).json({
                message: "Time Updated successfully",
                data: updateTime,
              });
            }
          }
        );
        // setTimeout(() => clearTime(data[0]._id), 180000);
      } else {
        res.status(400).send({ message: "student id not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.Update_Attaindence = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.send("object missing");
  }
  attandance.findByIdAndUpdate(
    req.params.id,
    {
      attendence: req.body.attendence,
    },
    { new: true },
    (err, attaindenceupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct attaindence id",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "attaindence Updated successfully",
          attaindenceupdatedData: attaindenceupdatedData,
        });
      }
    }
  );
};

exports.stopTime = (req, res) => {
  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");
  attandance
    .find({ $and: [{ studentId: req.params.id }, { date: value }] })
    .then((data) => {
      if (data.length) {
        attandance.findByIdAndUpdate(
          data[0]._id,

          {
            inclassDateTime: now,
            out_of_class: "no",
          },
          { new: true },

          (err, updateTime) => {
            if (err) {
              res.status(404).json({
                message: "please enter correct user id ",
                subErr: err.message,
              });
            } else {
              res.status(200).json({
                message: "Time Updated successfully",
                data: updateTime,
              });
            }
          }
        );
        // setTimeout(() => clearStopTime(data[0]._id), 180000);
      } else {
        res.status(400).send({ message: "student id not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

function clearTime(id) {
  attandance.findByIdAndUpdate(
    id,

    {
      outclassDateTime: null,
    },
    { new: true },

    (err, updateprofile) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updatedID");
      }
    }
  );
}

function clearStopTime(id) {
  attandance.findByIdAndUpdate(
    id,

    {
      inclassDateTime: null,
    },
    { new: true },

    (err, updateprofile) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updatedID");
      }
    }
  );
}
exports.Update_status = (req, res) => {
  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");

  console.log(value, "dateeeeeeeee");

  attandance
    // .find({ studentId: req.params.id })
    .find({ $and: [{ studentId: req.params.id }, { date: value }] })
    .then((dat) => {
      console.log(dat);

      if (dat.length) {
        attandance.findByIdAndUpdate(
          dat[0]._id,

          req.body,
          { new: true },

          (err, updateprofile) => {
            if (err) {
              res.status(404).json({
                message: "please enter correct user id ",
                subErr: err.message,
              });
            } else {
              console.log(updateprofile._id);
              Student.findOneAndUpdate(
                { _id: req.params.id },
                {
                  attaindence: updateprofile._id,
                }
              );
              // const studentRecords = new StudentRecords({
              //   studentId: req.params.id,
              //   attendence: updateprofile._id,
              // });
              // studentRecords.save();

              res.status(200).json({
                message: "status Updated successfully",
                updatestatus: updateprofile,
              });
            }
          }
        );
      } else {
        res.status(400).send({ message: "student id not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.dismiss = (req, res) => {
  var currentTime = req.body.time;
  var new_arr = [];
  for (var i = 0; i < req.body.id.length; i++) {
    new_arr.push(new mongodb.ObjectID(req.body.id[i]));
  }
  Student.updateMany(
    { _id: { $in: new_arr } },
    { dismiss: currentTime },
    { new: true },
    (err, studentupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct student id ",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "dismiss successfully",
          studentupdatedData: studentupdatedData,
        });
      }
    }
  );
};
exports.getCouncellorBYClass = async (req, res) => {
  User.find({ classId: req.params.id })
    .then((result) => {
      res.status(200).send({
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.getPreviousRecords = async (req, res) => {
  try {
    var uniqueids = [];
    var studentRecord = [];
    var studentsID = [];
    var id = req.params.id;
    var c = moment().startOf("month").toDate();
    var d = moment().endOf("month").toDate();

    var a = moment().startOf("week").toDate();
    var b = moment().endOf("week").toDate();

    const startOfMonth = date.format(c, "YYYY-MM-DD");
    const endOfMonth = date.format(d, "YYYY-MM-DD");

    const startOfWeek = date.format(a, "YYYY-MM-DD") ;
    const endOfWeek = date.format(b, "YYYY-MM-DD");
    const currentMonth= new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/').split('/'); 
    var datestr = req.body.toDate.split('-');
      
    if (req.body.fromDate && req.body.toDate) {
      var Studentattend = await attandance.find({
        classId :id,
        createdAt: { 
          $gte:req.body.fromDate, 
          $lte: req.body.toDate
      } 
      });
 

     if (Studentattend.length > 0 && currentMonth[1]>=datestr[1] ) {

        for (var i = 0; i < Studentattend.length; i++) {
          studentsID.push(Studentattend[i].studentId);
        }
  
        uniqueids = Object.values(
          Studentattend.reduce(
            (acc, cur) =>
              Object.assign(acc, { [cur.studentId.toString()]: cur.studentId }),
            {}
          )
        );
  
        for (var j = 0; j < uniqueids.length; j++) {
          var a = await Student.findOne({_id:uniqueids[j], $or:[
            
            { name:{$regex: req.body.searchName || "", $options:'i'}},
           
           
         ]});
         if(a){
          await attandance
          .find({ studentId: uniqueids[j] })
          .populate("counsellor_id")
          .then((att) => {
            studentRecord.push({
              studentId: a,
              attandan: att,
            });
          })
          .catch((error) => {
            res.status(400).send(error.message);
          });
         }
      
        }
      } else {
        var studentIDS = await Student.find({assignClass:id});
        for(var i=0 ; i<studentIDS.length ; i++){
          studentRecord.push({
            studentId: studentIDS[i],
            attandan: [],
          });
        }
       
      }

   

      res.send(studentRecord);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getAttandanceRecordsForPDF = async (req, res) => {

  try {
    if (req.body.fromDate && req.body.toDate) {


	// get date from given date
      var getdate = [];

      var startDate = new Date(req.body.fromDate); //YYYY-MM-DD
      var endDate = new Date(req.body.toDate); //YYYY-MM-DD
      
      var getDateArray = function (start, end) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {
          arr.push(new Date(dt));
          dt.setDate(dt.getDate() + 1);
        }
        return arr;
      };

      var dateArr = getDateArray(startDate, endDate);
      
      for (var i = 0; i < dateArr.length; i++) {
        getdate.push(dateArr[i]);
      }
    

	//   get class data
	const classData = await StudentClass.find({ _id: req.params.id })
  .then((response) => {
    return response
  })
  .catch((err) => {
    return err.message
  });
  
  // attandance data
  var councellorData = await User.find({ classId: req.params.id })
  .then((result) => {
          return result;
        })
        .catch((err) => {
          return err.message;
        });

      var Studentattend = await Student.aggregate([
        {
          $lookup: {
            from: "attandences",
            localField: "_id",
            foreignField: "studentId",
            as: "atan",
          },
        },
        {
          $unwind: "$atan",
        },

        {
          $match: {
            "atan.classId": ObjectId(req.params.id),
            "atan.date": {
              $gte: req.body.fromDate,
              $lte: req.body.toDate,
            },
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              name: "$name",
              lastName: "$lastName",
              fatherName: "$fatherName",
              DOB: "$DOB",
              address: "$address",
              image: "$image",
              assignClass: "$assignClass",
              medical: "$medical",
              emergency: "$emergency",
              dismiss: "$dismiss",
              attaindence: "$attaindence",
            },
            attandance: {
              $push: {
                _id: "$atan._id",
                student_id: "$atan.studentId",
                classId: "$atan.classId",
                date: "$atan.date",
                attandance: "$atan.attendence",
                createdAt: "$atan.createdAt",
                updatedAt: "$atan.updatedAt",
              },
            },
          },
        },
      ]);

      if (Studentattend.length == 0) {
        var Studentattend = await Student.aggregate([
          {
            $lookup: {
              from: "attandences",
              localField: "_id",
              foreignField: "studentId",
              as: "atan",
            },
          },
          {
            $unwind: "$atan",
          },
          {
            $match: {
              "atan.classId": ObjectId(req.params.id),
            },
          },
          {
            $group: {
              _id: {
                _id: "$_id",
                name: "$name",
                lastName: "$lastName",
                fatherName: "$fatherName",
                DOB: "$DOB",
                address: "$address",
                image: "$image",
                assignClass: "$assignClass",
                medicalemergency: "$medicalemergency",
              },
            },
          },
          {
            $addFields: {
				attandance: { $sum: "$null" },
            },
          },
        ]);

		req.body.identifier === 'week' ?
		createPDFForWeek(
			"Attandence_Report.pdf",
			Studentattend,
			getdate,
			councellorData,
			classData
		  ): req.body.identifier === 'month' ? createPDFForMonth(
			"Attandence_Report.pdf",
			Studentattend,
			getdate,
			councellorData,
			classData,
      req.body.fromDate
		  ): null;
      res.send(Studentattend);
    } else {
      req.body.identifier === 'week' ?
      createPDFForWeek(
        "Attandence_Report.pdf",
			Studentattend,
			getdate,
			councellorData,
			classData
		  ): req.body.identifier === 'month' ? createPDFForMonth(
        "Attandence_Report.pdf",
        Studentattend,
        getdate,
        councellorData,
        classData,
        req.body.fromDate
        ): null;

        res.send(Studentattend);
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


exports.GetStoreData = async (req, res) => {
  try {
    const classID = req.params.classid;
    var uniqueids = [];
    var studentRecord = [];
    var studentsID = [];
    var Studentattend = await attandance.find({ classId: classID });

    for (var i = 0; i < Studentattend.length; i++) {
      studentsID.push(Studentattend[i].studentId);
    }

    uniqueids = Object.values(
      Studentattend.reduce(
        (acc, cur) =>
          Object.assign(acc, { [cur.studentId.toString()]: cur.studentId }),
        {}
      )
    );

    for (var j = 0; j < uniqueids.length; j++) {
      var a = await Student.findById(uniqueids[j]);
      await attandance
        .find({ studentId: uniqueids[j] })
        .populate("counsellor_id")
        .then((att) => {
          studentRecord.push({
            studentId: a,
            attandan: att,
          });
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
    }

    res.send(studentRecord);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
