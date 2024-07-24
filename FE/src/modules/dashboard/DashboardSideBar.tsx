import { Button } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { BLUE_STORE_BOOK_API } from "../../apis";
import { Genre } from "../../types/genreType";
import { useDispatch } from "react-redux";
import { setGenre } from "../../store/actions/bookSlice";

const DashboardSideBar = () => {
    const dispatch = useDispatch();
    const [genres, setGenres] = useState<Genre[]>([]);
    useEffect(() => {
        async function fetchGenres() {
            const data = await BLUE_STORE_BOOK_API.GENRE.getAllGenres();
            if (data) setGenres(data);
        }
        fetchGenres();
    }, []);
    return (
        <Sider className="fixed left-0 right-0 h-full">
            <div className="w-full h-full bg-lite">
                <div className="p-4 text-xl font-bold text-center">Genres</div>
                <div className="overflow-y-auto h-[calc(100vh-64px)]">
                    {genres.map((genre) => (
                        <Button
                            key={genre.id}
                            type="link"
                            block
                            onClick={() => dispatch(setGenre(genre))}
                        >
                            {genre.name}
                        </Button>
                    ))}
                </div>
            </div>
        </Sider>
    );
};

export default DashboardSideBar;
