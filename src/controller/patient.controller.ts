import { Request, Response } from 'express';
import { Patient } from '../interfaces/patient.interface';
import { connection } from '../config/mysql.config';
import { QUERY } from '../querry/patient.query';
import { Code } from '../enums/code.enum';
import { HttpResponse } from '../utils/response';
import { Status } from '../enums/status.enum';
import { QueryResult, FieldPacket, ResultSetHeader } from 'mysql2';

type ResultSet = [QueryResult, FieldPacket[]]

export const getPatients = async (req: Request, res: Response): Promise<Response<Patient[]>> => {
    console.info(`[${new Date().toLocaleDateString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)

    try {
        const pool = await connection()
        const result: ResultSet  = await pool.query(QUERY.SELECT_PATIENTS)

        return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Patients retrieved', result[0]))
    } catch (error: unknown) {
        console.log(error)
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occured'))
    }
}

export const getPatientById = async (req: Request, res: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleDateString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)

    try {
        const pool = await connection()
        const result: ResultSet  = await pool.query(QUERY.SELECT_PATIENTS, [req.params.patientId])

        if((result[0] as Array<ResultSet>).length > 0) {
            return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Patient retrieved', result[0]))
        } else {
            return res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'))
        }
    } catch (error: unknown) {
        console.log(error)
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occured'))
    }
}

export const createPatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleDateString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)

    let patient: Patient = { ...req.body }

    try {
        const pool = await connection()
        const result: ResultSet  = await pool.query(QUERY.SELECT_PATIENTS, Object.values(patient))
        patient = {id: (result[0] as ResultSetHeader).insertId, ...req.body }
        
        return res.status(Code.CREATED).send(new HttpResponse(Code.CREATED, Status.CREATED, 'Patient created', patient))
    } catch (error: unknown) {
        console.log(error)
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occured'))
    }
}

export const updatePatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleDateString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)

    let patient: Patient = { ...req.body }

    try {
        const pool = await connection()
        const result: ResultSet  = await pool.query(QUERY.SELECT_PATIENTS, [req.params.patientId])

        if((result[0] as Array<ResultSet>).length > 0) {
            const result: ResultSet  = await pool.query(QUERY.UPDATE_PATIENT, [ ...Object.values(patient), req.params.patientId])

            return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Patient updated', { ...patient, id: req.params.patientid}))
        } else {
            return res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'))
        }
    } catch (error: unknown) {
        console.log(error)
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occured'))
    }
}

export const deletePatient = async (req: Request, res: Response): Promise<Response<Patient>> => {
    console.info(`[${new Date().toLocaleDateString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)

    try {
        const pool = await connection()
        const result: ResultSet  = await pool.query(QUERY.SELECT_PATIENT, [req.params.patientId])

        if((result[0] as Array<ResultSet>).length > 0) {
            const result: ResultSet  = await pool.query(QUERY.DELETE_PATIENT, [req.params.patientId])

            return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Patient deleted'))
        } else {
            return res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient not found'))
        }
    } catch (error: unknown) {
        console.log(error)
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occured'))
    }
}
