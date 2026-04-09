<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HotelRequest;
use App\Models\Hotel;
use Illuminate\Support\Facades\DB;

class HotelController extends Controller
{
    public function index()
    {
        return view('admin.hotels.index');
    }

    public function store(HotelRequest $request, Hotel $hotel)
    {
        $data = $request->validated();

        if ($request->hasFile('images')) {
            $data['images'] = $this->uploadMultipleImages($request->file('images'), 'hotels');
        }

        $hotel->create($data);

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel created successfully.');
    }

    public function show(Hotel $hotel)
    {
        return view('admin.hotels.show', compact('hotel'));
    }

    public function edit(Hotel $hotel)
    {
        return view('admin.hotels.edit', compact('hotel'));
    }

    public function update(HotelRequest $request, Hotel $hotel)
    {
        $data = $request->validated();

        if ($request->hasFile('images')) {
            $data['images'] = $this->syncImages(
                $hotel->images,
                $request->file('images'),
                $request->delete_images,
                'hotels'
            );
        }

        $hotel->update($data);

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel updated successfully.');
    }

    public function destroy(Hotel $hotel)
    {
        DB::beginTransaction();
        try {
            $hotel->hasFiles('images') ? $this->deleteMultipleImages($hotel->images) : null;
            $hotel->delete();
            $hotel->rooms()->delete();
            DB::commit();
            return redirect()->route('admin.hotels.index')->with('success', 'Hotel deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.hotels.index')->with('error', 'Hotel deletion failed.');
        }
    }
}
