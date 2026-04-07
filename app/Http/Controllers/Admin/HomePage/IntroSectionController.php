<?php

namespace App\Http\Controllers\Admin\HomePage;

use App\Http\Controllers\Controller;
use App\Http\Requests\CounterInfoRequest;
use App\Http\Requests\IntroSectionRequest;
use App\Models\HomePage\IntroCountInfo;
use App\Models\HomePage\IntroSection;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IntroSectionController extends Controller
{
    public function introSection(Request $request)
    {
        // first, get the language info from db
        $language = Language::where('code', $request->language)->firstOrFail();
        $information['language'] = $language;

        // then, get the intro section info of that language from db
        $information['data'] = IntroSection::where('language_id', $language->id)->first();

        // also, get the features of that language from db
        $information['counterInfos'] = IntroCountInfo::where('language_id', $language->id)
            ->orderBy('id', 'desc')
            ->get();

        // get all the languages from db
        $information['langs'] = Language::all();

        return view('admin.home_page.intro_section.index', $information);
    }

    public function updateIntroInfo(IntroSectionRequest $request, $language)
    {
        if ($request->hasFile('intro_img')) {
            $allowedExtensions = array('jpg', 'jpeg', 'png', 'svg');
            $fileExtension = $request->file('intro_img')->getClientOriginalExtension();

            $rule = [
                'intro_img' => function ($attribute, $value, $fail) use ($allowedExtensions, $fileExtension) {
                    if (!in_array($fileExtension, $allowedExtensions)) {
                        $fail('Only .jpg, .jpeg, .png and .svg file is allowed.');
                    }
                }
            ];

            $validator = Validator::make($request->all(), $rule);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator);
            }
        }

        $lang = Language::where('code', $language)->first();
        $data = IntroSection::where('language_id', $lang->id)->first();
        $in = $request->all();

        if ($data == null) {

            $in = $request->all();
            if ($request->hasFile('intro_img')) {
                $filename = time() . '.' . $request->file('intro_img')->getClientOriginalExtension();
                $directory = public_path('assets/img/intro_section/');
                @mkdir($directory, 0775, true);
                $request->file('intro_img')->move($directory, $filename);
                $in['intro_img'] = $filename;
            }

            if ($request->hasFile('member_image')) {
                $filename = time() . '.' . $request->file('member_image')->getClientOriginalExtension();
                $directory = public_path('assets/img/intro_section/member_image/');
                @mkdir($directory, 0775, true);
                $request->file('member_image')->move($directory, $filename);
                $in['member_image'] = $filename;
            }
            if ($request->hasFile('background_image')) {
                $filename = time() . '.' . $request->file('background_image')->getClientOriginalExtension();
                $directory = public_path('assets/img/intro_section/background_image/');
                @mkdir($directory, 0775, true);
                $request->file('background_image')->move($directory, $filename);
                $in['background_image'] = $filename;
            }
            $in['language_id'] =  $lang->id;

            IntroSection::create($in);
        } else {
            if ($request->hasFile('intro_img')) {
                $filename = time() . '.' . $request->file('intro_img')->getClientOriginalExtension();
                $directory = public_path('assets/img/intro_section/');
                @mkdir($directory, 0775, true);
                $request->file('intro_img')->move($directory, $filename);
                @unlink(public_path('assets/img/intro_section/') . $data->intro_img);
                $in['intro_img'] = $filename;
            }

            if ($request->hasFile('member_image')) {
                $filename = time() . '.' . $request->file('member_image')->getClientOriginalExtension();
                $directory = public_path('assets/img/intro_section/member_image/');
                @mkdir($directory, 0775, true);
                $request->file('member_image')->move($directory, $filename);
                @unlink(public_path('assets/img/intro_section/member_image/') . $data->member_image);
                $in['member_image'] = $filename;
            }
            if ($request->hasFile('background_image')) {
                $filename = time() . '.' . $request->file('background_image')->getClientOriginalExtension();
                $directory = public_path('assets/img/intro_section/background_image/');
                @mkdir($directory, 0775, true);
                $request->file('background_image')->move($directory, $filename);
                @unlink(public_path('assets/img/intro_section/background_image/') . $data->background_image);
                $in['background_image'] = $filename;
            }
            $data->update($in);
        }

        session()->flash('success', 'Intro section info updated successfully!');

        return redirect()->back();
    }


    public function createCountInfo(Request $request)
    {
        $information['langs'] = Language::get();

        return view('admin.home_page.intro_section.create', $information);
    }

    public function storeCountInfo(CounterInfoRequest $request)
    {
        $in = $request->all();

        IntroCountInfo::create($in);

        session()->flash('success', 'New counter info added successfully!');

        return 'success';
    }

    public function editCountInfo(Request $request, $id)
    {
        $information['counterInfo'] = IntroCountInfo::where('id', $id)->firstOrFail();

        return view('admin.home_page.intro_section.edit', $information);
    }

    public function updateCountInfo(CounterInfoRequest $request, $id)
    {
        IntroCountInfo::where('id', $id)->first()->update($request->all());

        session()->flash('success', 'Counter info updated successfully!');

        return 'success';
    }

    public function deleteCountInfo(Request $request)
    {
        IntroCountInfo::where('id', $request->counterInfo_id)->first()->delete();

        session()->flash('success', 'Counter info deleted successfully!');

        return redirect()->back();
    }
}
