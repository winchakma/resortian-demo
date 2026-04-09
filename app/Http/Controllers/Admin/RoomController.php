<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoomRequest;
use App\Models\Room;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    public function index()
    {
        return view('admin.rooms.index');
    }

    public function store(RoomRequest $request, Room $room)
    {
        $data = $request->validated();

        if ($request->hasFile('images')) {
            $data['images'] = $this->uploadMultipleImages($request->file('images'), 'rooms');
        }

        $room->create($data);

        return redirect()->route('admin.rooms.index')->with('success', 'Room created successfully.');
    }

    public function show(Room $room)
    {
        return view('admin.rooms.show', compact('room'));
    }

    public function edit(Room $room)
    {
        return view('admin.rooms.edit', compact('room'));
    }

    public function update(RoomRequest $request, Room $room)
    {
        $data = $request->validated();

        if ($request->hasFile('images')) {
            $data['images'] = $this->syncImages(
                $room->images,
                $request->file('images'),
                $request->delete_images,
                'rooms'
            );
        }

        $room->update($data);

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel updated successfully.');
    }

    public function destroy(Room $room)
    {
        DB::beginTransaction();
        try {
            $room->hasFiles('images') ? $this->deleteMultipleImages($room->images) : null;
            $room->delete();
            DB::commit();
            return redirect()->route('admin.rooms.index')->with('success', 'Room deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.rooms.index')->with('error', 'Room deletion failed.');
        }
    }
}
