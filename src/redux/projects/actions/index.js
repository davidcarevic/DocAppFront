import * as types from './types';
export const setProjectsByTeam = projects =>{
    return{
        type:types.SET_PROJECTS_BY_TEAMS,
        payload:projects
    }
}