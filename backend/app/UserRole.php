<?php

namespace App;

enum UserRole:string
{
   case JOBSEEKER = 'jobseeker';
    case RECRUITER = 'recruiter';
    case ADMIN = 'admin';
}
