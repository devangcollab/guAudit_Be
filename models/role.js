// const mongoose = require("mongoose");

// const permissionSchema = new mongoose.Schema({
//   C: {
//     type: Boolean,
//     default: false
//   },
//   R: {
//     type: Boolean,
//     default: true
//   },
//   U: {
//     type: Boolean,
//     default: false
//   },
//   D: {
//     type: Boolean,
//     default: false
//   },
// });

// const roleSchema = mongoose.Schema(
//   {
//     roleName: {
//       type: String,
//       trim: true,
//     },
//     pages: {
//       type: Array,
//     },
//     permissions: {
//       type: permissionSchema,
//     },
//     isDelete: {
//       type: Number,
//       enum: [1, 0],
//       default: 0,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("role", roleSchema);
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      enum: ['SuperAdmin', 'Admin', 'User'],
      required: true,
      trim: true,
    },
    roleId:{
      type:Number,
      default:1
    },
    permissions: [
      {
        module: {
          type: String,
          required: true,
          trim: true,
        },
        actions: [
          {
            type: String,
            enum: ['create', 'read', 'update', 'delete'],
          },
        ],
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('role', roleSchema);
