import { NavLink } from "react-router-dom";

export default function Nav(){
    return (
        <nav>
            <NavLink to="/feed">Feed </NavLink>
            <NavLink to="/dashboard">Dashboard </NavLink>
        </nav>
    )
}